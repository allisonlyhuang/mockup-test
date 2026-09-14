import nodemailer from "nodemailer";
import { buildConfirmationEmail } from "./emailTemplate.js";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitStore = new Map();

function getClientIp(req) {
  return req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.socket?.remoteAddress
    || "unknown";
}

function isSameOrigin(req) {
  const origin = req.headers.origin;
  const host = req.headers.host;
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: "Origin not allowed" });
  }

  const now = Date.now();
  const clientIp = getClientIp(req);
  const recentRequests = (rateLimitStore.get(clientIp) || [])
    .filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("Retry-After", "60");
    return res.status(429).json({ error: "Too many requests" });
  }
  recentRequests.push(now);
  rateLimitStore.set(clientIp, recentRequests);

  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({ error: "Invalid request body" });
  }
  if (JSON.stringify(body).length > 20000) {
    return res.status(413).json({ error: "Request body is too large" });
  }

  const { type, uciEmail, fullName, name, email, organization, interests, otherDetails } = body;
  const isInquiry = type === "inquiry";

  if (isInquiry) {
    const validEmail = typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const validInterests = interests === undefined
      || (Array.isArray(interests) && interests.length <= 10 && interests.every((item) => typeof item === "string" && item.length <= 80));

    if (
      typeof name !== "string" || name.trim().length === 0 || name.length > 120
      || !validEmail
      || (organization !== undefined && (typeof organization !== "string" || organization.length > 200))
      || (otherDetails !== undefined && (typeof otherDetails !== "string" || otherDetails.length > 2000))
      || !validInterests
    ) {
      return res.status(400).json({ error: "Invalid inquiry details" });
    }
  } else {
    const requiredApplicationFields = [
      fullName,
      uciEmail,
      body.year,
      body.roleInterest,
      body.takeHomeURL,
      body.whyJoin,
    ];
    const validApplicationStrings = requiredApplicationFields.every(
      (value) => typeof value === "string" && value.trim().length > 0 && value.length <= 5000
    );
    const validApplicationEmail = typeof uciEmail === "string"
      && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uciEmail.trim());
    const validApplicationUrls = isValidUrl(body.takeHomeURL)
      && (!body.portfolioURL || isValidUrl(body.portfolioURL));

    if (!validApplicationStrings || !validApplicationEmail || !validApplicationUrls) {
      return res.status(400).json({ error: "Invalid application details" });
    }
  }

  const endpoint = process.env.SHEET_ENDPOINT;
  if (!endpoint) {
    return res.status(500).json({ error: "Server misconfigured" });
  }
  const emailConfigured = Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASS);
  if (isInquiry && !emailConfigured) {
    return res.status(500).json({ error: "Email service is not configured" });
  }

  // Forward submission to Google Sheet
  try {
    const sheetResponse = await fetch(endpoint, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    });
    if (!sheetResponse.ok) {
      return res.status(502).json({ error: "Failed to submit" });
    }
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Failed to submit" });
  }

  let emailSent = false;
  if (emailConfigured) {
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
      emailSent = true;
    } catch (emailErr) {
      console.error("Email error:", emailErr.message);
    }
  }

  return res.status(200).json({ result: "success", emailSent });
}
