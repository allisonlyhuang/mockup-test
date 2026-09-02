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

  // Send confirmation email via Brevo API
  const { uciEmail, fullName } = req.body ?? {};
  if (uciEmail && process.env.BREVO_API_KEY) {
    try {
      const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
        body: JSON.stringify({
          sender: { name: "Design @ UCI Mockup", email: process.env.BREVO_SENDER },
          to: [{ email: uciEmail, name: fullName ?? "Applicant" }],
          subject: "Your application has been received.",
          htmlContent: buildConfirmationEmail(fullName ?? "there"),
        }),
      });
      const data = await emailRes.json();
      if (!emailRes.ok) console.error("Brevo error:", data);
      else console.log("Email sent:", data.messageId);
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
    }
  }

  return res.status(200).json({ result: "success" });
}
