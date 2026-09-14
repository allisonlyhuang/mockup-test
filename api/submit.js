import nodemailer from "nodemailer";
import { buildConfirmationEmail } from "./emailTemplate.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const endpoint = process.env.SHEET_ENDPOINT;
  if (!endpoint) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // Forward submission to Google Sheet
  try {
    await fetch(endpoint, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(req.body),
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Failed to submit" });
  }

  const { type, uciEmail, fullName, name, email, organization, interests, otherDetails } = req.body ?? {};
  const isInquiry = type === "inquiry";

  if (isInquiry && (!email || !name)) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASS,
        },
      });

      await transporter.sendMail(isInquiry
        ? {
            from: `"Mockup Website" <${process.env.GMAIL_USER}>`,
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `New inquiry from ${name} ${organization || ""}`,
            text: [
              `Name: ${name}`,
              `Email: ${email}`,
              `Organization: ${organization || "Not provided"}`,
              `Interested in: ${interests?.join(", ") || "Not specified"}`,
              `Other details: ${otherDetails || "None"}`,
            ].join("\n"),
          }
        : {
            from: `"Design at UCI Mockup" <${process.env.GMAIL_USER}>`,
            to: uciEmail,
            subject: "Your application has been received.",
            html: buildConfirmationEmail(fullName ?? "there"),
          });
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
      if (isInquiry) return res.status(500).json({ error: "Failed to send inquiry" });
    }
  } else if (isInquiry) {
    return res.status(500).json({ error: "Email service is not configured" });
  }

  return res.status(200).json({ result: "success" });
}
