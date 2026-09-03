const LOGO = "https://mockup-test-six.vercel.app/top_logo.png";
const SITE = "https://mockup-test-six.vercel.app";

export function buildConfirmationEmail(name = "applicant") {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;margin:0;padding:32px 0">
  <div style="background:#ffffff;max-width:560px;margin:0 auto;border-radius:8px;border:1px solid #e4e4e7;overflow:hidden">
    <div style="padding:32px 40px 0">
      <img src="${LOGO}" width="111" height="41" alt="Design at UCI" style="display:block"/>
    </div>
    <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0 0"/>
    <div style="padding:32px 40px">
      <h2 style="font-size:20px;font-weight:600;color:#18181b;margin:0 0 16px;line-height:1.4">Your application has been received.</h2>
      <p style="font-size:15px;color:#18181b;line-height:1.6;margin:0 0 8px">Hi ${name},</p>
      <p style="font-size:15px;color:#18181b;line-height:1.6;margin:0 0 24px">Thank you so much for your interest in our program! We're so excited for what's in store. Make sure you can attend all the events below. Decisions will be released October 4th. Keep an eye out!</p>

      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#71717a;margin:0 0 10px">Important Events</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-radius:6px 6px 0 0;vertical-align:top;width:160px">
            <strong style="font-size:13px;color:#18181b;white-space:nowrap">Mon, Dec 4 @ 7 PM</strong>
          </td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-left:none;border-radius:0 6px 6px 0;vertical-align:top">
            <span style="font-size:13px;font-weight:600;color:#18181b">Kick-Off Session</span><br/>
            <span style="font-size:13px;color:#52525b;line-height:1.5">Roblox announces the program's problem statement; initial meetings with your team and UCI faculty mentor before sprints begin.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 0 6px;vertical-align:top;width:160px">
            <strong style="font-size:13px;color:#18181b;white-space:nowrap">Fri, Oct 12 @ 7 PM</strong>
          </td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;border-left:none;border-radius:0 0 6px 0;vertical-align:top">
            <span style="font-size:13px;font-weight:600;color:#18181b">Final Case Study &amp; Demo Day</span><br/>
            <span style="font-size:13px;color:#52525b;line-height:1.5">Present finished work to the program, faculty, and Roblox stakeholders; network and get feedback.</span>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#71717a;margin:0 0 10px">Weekly Events</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 8px">
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-radius:6px 6px 0 0;vertical-align:top;width:160px">
            <strong style="font-size:13px;color:#18181b;white-space:nowrap">Every Mon, Oct 19–Nov 23 @ 3 PM</strong>
          </td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-left:none;border-radius:0 6px 6px 0;vertical-align:top">
            <span style="font-size:13px;font-weight:600;color:#18181b">Open Session w/ UCI Mentor</span><br/>
            <span style="font-size:13px;color:#52525b;line-height:1.5">Program announcements, then time with your faculty mentor to work through blockers and prep for stakeholder meetings.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;vertical-align:top;width:160px">
            <strong style="font-size:13px;color:#18181b;white-space:nowrap">Every Fri, Oct 22–Nov 26 @ 5 PM</strong>
          </td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;border-left:none;vertical-align:top">
            <span style="font-size:13px;font-weight:600;color:#18181b">Stakeholder Meeting w/ Roblox</span><br/>
            <span style="font-size:13px;color:#52525b;line-height:1.5">Show progress, discuss next steps, realign on business goals. Treat these professionally.</span>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;border-radius:0 0 0 6px;vertical-align:top;width:160px">
            <strong style="font-size:13px;color:#18181b;white-space:nowrap">As needed</strong>
          </td>
          <td style="padding:10px 12px;border:1px solid #e4e4e7;border-top:none;border-left:none;border-radius:0 0 6px 0;vertical-align:top">
            <span style="font-size:13px;font-weight:600;color:#18181b">Team Meetings <span style="font-weight:400;color:#71717a">(Optional)</span></span><br/>
            <span style="font-size:13px;color:#52525b;line-height:1.5">Self-facilitated to realign on progress, goals, and more.</span>
          </td>
        </tr>
      </table>
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
