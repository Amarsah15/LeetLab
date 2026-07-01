import { sendEmail } from "./sendEmail.js";

const year = new Date().getFullYear();

const emailHeader = `
  <div style="background:#0f172a;padding:40px 48px;text-align:center;border-bottom:1px solid #1e293b">
    <div style="display:inline-flex;align-items:center;justify-content:center;gap:10px;margin-bottom:8px">
      <div style="width:36px;height:36px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(99,102,241,0.3)">
        <span style="color:#ffffff;font-family:monospace;font-size:16px;font-weight:700">&lt;/&gt;</span>
      </div>
      <span style="color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:24px;font-weight:800;letter-spacing:-0.5px">Leet<span style="color:#6366f1">Lab</span></span>
    </div>
`;

const emailFooter = `
  <div style="background:#0b0f19;border-top:1px solid #1e293b;padding:20px 40px;text-align:center">
    <p style="font-size:12px;color:#64748b;margin:0">© ${year} LeetLab · Built for developers</p>
  </div>
`;

const emailWrapper = (content) => `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:20px auto;background-color:#0f172a;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3)">
    ${content}
    ${emailFooter}
  </div>
`;

export const sendRegistrationOtpMail = async (to, otp) => {
  const html = emailWrapper(`
    ${emailHeader}
      <p style="color:#a5b4fc;font-size:13px;margin:0;font-weight:500">Verify your email to get started</p>
    </div>
    <div style="padding:32px 40px;background:#0f172a">
      <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px">
        Hi there! Use the OTP below to complete your registration. It expires in <strong>10 minutes</strong>.
      </p>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <p style="font-size:12px;color:#818cf8;margin:0 0 10px;letter-spacing:.05em;text-transform:uppercase;font-weight:600">Your verification code</p>
        <p style="font-size:38px;font-weight:800;letter-spacing:12px;color:#38bdf8;margin:0;padding-left:12px">${otp}</p>
      </div>
      <p style="font-size:13px;color:#64748b;line-height:1.5">
        If you didn't request this, you can safely ignore this email. Do not share this code with anyone.
      </p>
    </div>
  `);

  await sendEmail(
    to,
    "LeetLab Registration OTP",
    `Your OTP for LeetLab registration is: ${otp}. It is valid for 10 minutes.`,
    html,
  );
};

export const sendPasswordResetOtpMail = async (to, otp) => {
  const html = emailWrapper(`
    ${emailHeader}
      <p style="color:#fca5a5;font-size:13px;margin:0;font-weight:500">Password reset request</p>
    </div>
    <div style="padding:32px 40px;background:#0f172a">
      <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:24px">
        We received a request to reset your password. Use the code below — it's valid for <strong>10 minutes</strong>.
      </p>
      <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
        <p style="font-size:12px;color:#f97316;margin:0 0 10px;letter-spacing:.05em;text-transform:uppercase;font-weight:600">Password reset code</p>
        <p style="font-size:38px;font-weight:800;letter-spacing:12px;color:#fb923c;margin:0;padding-left:12px">${otp}</p>
      </div>
      <div style="background:#27272a;border-left:4px solid #ef4444;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px">
        <p style="font-size:13px;color:#fca5a5;margin:0;line-height:1.5">
          If you didn't request a password reset, please secure your account immediately and ignore this email.
        </p>
      </div>
      <p style="font-size:13px;color:#64748b;line-height:1.5">Never share this code. LeetLab support will never ask for it.</p>
    </div>
  `);

  await sendEmail(
    to,
    "LeetLab Password Reset OTP",
    `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    html,
  );
};

export const sendPasswordChangedConfirmationMail = async (
  to,
  isReset = false,
) => {
  const subject = isReset
    ? "🔒 LeetLab Password Reset Successful"
    : "🔒 LeetLab Password Changed Successfully";

  const headingText = isReset
    ? "Hi there, your password has been reset successfully."
    : "Hi there, your password has been updated successfully.";

  const bodyText = isReset
    ? "Your LeetLab account password was reset. If this was you, you can now log in with your new password. If you didn't request this, please contact support immediately."
    : "Your LeetLab account password was changed. If this was you, no action is needed. If you didn't make this change, please contact support immediately.";

  const loginUrl = isReset
    ? `${process.env.CLIENT_URL}/login`
    : `${process.env.CLIENT_URL}`;

  const html = emailWrapper(`
    ${emailHeader}
      <p style="color:#a5b4fc;font-size:13px;margin:0;font-weight:500">Account security update</p>
    </div>
    <div style="padding:32px 40px;background:#0f172a">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:#064e3b;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;text-align:center;box-shadow:0 4px 12px rgba(5,150,105,0.2)">🔒</div>
      </div>
      <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:16px;text-align:center">${headingText}</p>
      <p style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:24px;text-align:center">
        ${bodyText}
      </p>
      ${
        !isReset
          ? `
      <div style="background:#1e293b;border-left:4px solid #10b981;border-radius:0 8px 8px 0;padding:14px 20px;margin-bottom:28px">
        <p style="font-size:13px;font-weight:600;color:#34d399;margin:0 0 2px">Password changed</p>
        <p style="font-size:12px;color:#94a3b8;margin:0">If this wasn't you, contact support right away.</p>
      </div>
      `
          : ""
      }
      <div style="text-align:center">
        <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 4px 12px rgba(99,102,241,0.3)">
          Log in to your account →
        </a>
      </div>
    </div>
  `);

  await sendEmail(
    to,
    subject,
    isReset
      ? `Hi there,\n\nYour LeetLab account password has been reset successfully.\n\n— The LeetLab Team`
      : `Hi there,\n\nYour LeetLab account password has been changed successfully.\n\n— The LeetLab Team`,
    html,
  );
};

export const sendWelcomeMail = async (to, name) => {
  const html = emailWrapper(`
    ${emailHeader}
      <p style="color:#a5b4fc;font-size:13px;margin:0;font-weight:500">Welcome to the community</p>
    </div>
    <div style="padding:32px 40px;background:#0f172a">
      <div style="text-align:center;margin-bottom:24px">
        <div style="display:inline-block;background:#0b0f19;border-radius:50%;width:64px;height:64px;line-height:64px;font-size:32px;text-align:center;box-shadow:0 4px 12px rgba(99,102,241,0.1)">🎉</div>
      </div>
      <p style="font-size:15px;color:#94a3b8;line-height:1.6;margin-bottom:16px;text-align:center">Hi <strong>${name}</strong>, your account is ready!</p>
      <p style="font-size:14px;color:#64748b;line-height:1.7;margin-bottom:24px;text-align:center">
        You've successfully joined LeetLab. Start solving problems, track your progress, and level up your coding skills.
      </p>
      <div style="background:#1e293b;border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid #1e293b">
        <p style="font-size:13px;color:#818cf8;font-weight:600;margin:0 0 10px;text-transform:uppercase;letter-spacing:.05em">What you can do now:</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div style="font-size:13px;color:#94a3b8">✦ &nbsp;Solve 100+ coding challenges</div>
          <div style="font-size:13px;color:#94a3b8">✦ &nbsp;Join contests and climb the leaderboard</div>
          <div style="font-size:13px;color:#94a3b8">✦ &nbsp;Track your solve streak and analytics</div>
        </div>
      </div>
      <div style="text-align:center">
        <a href="${process.env.CLIENT_URL}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;box-shadow:0 4px 12px rgba(99,102,241,0.3)">
          Start coding →
        </a>
      </div>
    </div>
  `);

  await sendEmail(
    to,
    "🎉 Welcome to LeetLab — Let's Get Started!",
    `Hi ${name},\n\nYour registration was successful! We're thrilled to have you join LeetLab.\n\nHappy coding!\n— The LeetLab Team`,
    html,
  );
};
