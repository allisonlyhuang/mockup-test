import { Resend } from "resend";
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

  // Send confirmation email to applicant
  const { uciEmail, fullName } = req.body ?? {};
  if (uciEmail && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const html = buildConfirmationEmail(fullName ?? "there");

      await resend.emails.send({
        from: "Design @ UCI Mockup <onboarding@resend.dev>",
        to: uciEmail,
        subject: "Your application has been received.",
        html,
      });
    } catch (emailErr) {
      console.error("Email error:", emailErr);
    }
  }

  return res.status(200).json({ result: "success" });
}
