const userSignupVerificationTemplate = (
  fullName,
  verificationCode,
  otpExpiryTime,
  name,
  copyright,
  logo
) => {
  return `
  <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verify Your Email Address</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;font-family:'Poppins',Arial,sans-serif;background-color:#f4f4f4;color:#333;">
<table cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;background-color:#f4f4f4;">
<tr>
<td align="center" style="padding:40px 0;">
<table cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background-color:#fff;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);">
<tr>
<td align="center" style="padding-top:20px;">
  <table
    cellpadding="0"
    cellspacing="0"
    style="
      background:#111B28; 
      background:linear-gradient(to right, #111B28, #0B1220);
      border-radius:8px;
    "
  >
    <tr>
      <td style="padding:12px 18px;">
        <img
  src="${logo}"
  alt="Company Logo"
  width="80"
  style="display:block;height:auto;"
/>
      </td>
    </tr>
  </table>
</td>
</tr>
<tr>
<td style="padding:40px 30px;">
<h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;color:#0084a5;text-align:center;font-weight:600;">Verify Your Email Address</h1>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">Hi ${fullName},</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5;">Use the OTP below to complete your sign in:</p>
<table cellpadding="0" cellspacing="0" width="100%">
<tr>
<td align="center" style="padding:30px 0;">
<div style="display:inline-block;padding:10px 20px;background-color:#111B28DB;color:#fff;font-size:24px;font-weight:600;border-radius:8px;letter-spacing:4px;">
${verificationCode}
</div>
</td>
</tr>
</table>
<p style="margin:0;font-size:16px;line-height:1.5;">This OTP is valid for ${otpExpiryTime} minutes.</p>
<p style="margin:20px 0 0;font-size:16px;line-height:1.5;">Best regards,<br>${name}</p>
</td>
</tr>
<tr>
<td style="padding:20px 30px;background-color:#f8f8f8;border-bottom-left-radius:8px;border-bottom-right-radius:8px;font-size:14px;color:#888;text-align:center;">
<p style="margin:0 0 10px;">&copy; ${copyright}</p>
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>
  `;
};

export default userSignupVerificationTemplate;
