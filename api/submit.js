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

  // Send confirmation email via Gmail SMTP
  const { uciEmail, fullName } = req.body ?? {};
  if (uciEmail && process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Design @ UCI Mockup" <${process.env.GMAIL_USER}>`,
        to: uciEmail,
        subject: "Your application has been received.",
        html: buildConfirmationEmail(fullName ?? "there"),
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
    }
  }

  return res.status(200).json({ result: "success" });
}
