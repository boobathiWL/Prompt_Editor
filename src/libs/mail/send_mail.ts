import transporter from "./transporter";

const textEmailBody = (loginUrl, type) => `
Hi there,

We received a request to ${
  type == "login" ? "log in" : "password reset"
} to your account. To ${
  type == "login" ? "log in" : "password reset"
}, please click the link below:

${loginUrl}

If you did not request this ${
  type == "login" ? "login" : "password reset"
}, please ignore this email.

Best regards,
The GravityWrite Team
`;

const htmlEmailBody = (loginUrl, type) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${type == "login" ? "Login Link" : "Password reset link"}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #fff;
      background-color: #007bff;
      text-decoration: none;
      border-radius: 4px;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Hi there,</p>
    <p>We received a request to ${
      type == "login" ? "log in" : "password reset"
    } to your account. To ${
  type == "login" ? "log in" : "password reset"
}, please click the button below:</p>
    <a href="${loginUrl}" class="button">${
  type == "login" ? "Log In" : "Password Reset"
}</a>
    <p>If you did not request this ${
      type == "login" ? "login" : "password reset"
    }, please ignore this email.</p>
    <p class="footer">Best regards,<br>The GravityWrite Team</p>
  </div>
</body>
</html>
`;

export default async function sendEmail(to, loginUrl, type) {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: `Prompt Editor ${
      type == "login" ? "Login link" : "Password reset link"
    }`,
    text: textEmailBody(loginUrl, type),
    html: htmlEmailBody(loginUrl, type),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info);
    if (info.response == "250 Great success") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
