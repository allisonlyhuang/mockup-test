const LOGO = "https://mockup-test-six.vercel.app/top_logo.png";
const SITE  = "https://mockup-test-six.vercel.app";

export function buildConfirmationEmail(name = "applicant") {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:32px 0">
  <div style="background:#ffffff;max-width:560px;margin:0 auto;border-radius:8px;border:1px solid #e4e4e7;overflow:hidden">
    <div style="padding:32px 40px 0">
      <img src="${LOGO}" width="111" height="41" alt="Design @ UCI" style="display:block"/>
    </div>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0 0"/>
    <div style="padding:32px 40px">
      <h2 style="font-size:20px;font-weight:600;color:#18181b;margin:0 0 16px;line-height:1.4">Your application has been received.</h2>
      <p style="font-size:15px;color:#18181b;line-height:1.6;margin:0 0 8px">Hi ${name},</p>
      <p style="font-size:15px;color:#18181b;line-height:1.6;margin:0 0 28px">Thank you so much for your interest in our program! We're so excited for what's in store. View the program timeline and make sure you can attend all necessary events. Decisions will be released October 4th. Keep an eye out!</p>
      <a href="${SITE}" style="background:#111827;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 24px;border-radius:6px;display:inline-block">View Timeline</a>
    </div>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:0"/>
    <div style="padding:24px 40px">
      <p style="font-size:12px;color:#71717a;line-height:1.6;margin:0 0 8px">Do not reply to this email. For any questions, reach out to <a href="mailto:design+mockup@uci.edu" style="color:#71717a;text-decoration:underline">design+mockup@uci.edu</a>.</p>
      <hr style="border:none;border-top:1px solid #e4e4e7;margin:16px 0"/>
      <p style="font-size:12px;color:#71717a;line-height:1.6;margin:0 0 4px">Design @ UCI · Mockup x Roblox · Fall 2026</p>
      <p style="font-size:12px;color:#71717a;margin:0">
        <a href="${SITE}" style="color:#71717a;text-decoration:underline">Website</a>
        &nbsp;·&nbsp;
        <a href="https://instagram.com/example" style="color:#71717a;text-decoration:underline">Instagram</a>
        &nbsp;·&nbsp;
        <a href="mailto:design+mockup@uci.edu" style="color:#71717a;text-decoration:underline">Email</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}
