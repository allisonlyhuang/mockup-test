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

  // Send confirmation email via Brevo SMTP
  const { uciEmail, fullName } = req.body ?? {};
  if (uciEmail && process.env.BREVO_USER && process.env.BREVO_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.BREVO_USER,
          pass: process.env.BREVO_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Design @ UCI Mockup" <' + process.env.BREVO_USER + '>',
        to: uciEmail,
        subject: "Your application has been received.",
        html: buildConfirmationEmail(fullName ?? "applicant"),
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }
  }

  return res.status(200).json({ result: "success" });
}
