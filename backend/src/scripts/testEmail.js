require("dotenv").config();

const {
  sendEmail,
  verifyEmailConnection
} = require(
  "../features/notifications/email.service.js"
);

async function testEmail() {
  try {
    console.log(
      "Checking email connection..."
    );

    await verifyEmailConnection();

    console.log(
      "SMTP connection successful"
    );

    const result = await sendEmail({
      to: process.env.EMAIL_USER,

      subject:
        "PulseWatch Email Test",

      text:
        "PulseWatch email alerts are working.",

      html: `
        <h2>PulseWatch</h2>
        <p>Email alerts are working successfully.</p>
      `
    });

    console.log(
      "Email sent:",
      result.messageId
    );
  } catch (error) {
    console.error(
      "Email test failed:",
      error
    );
  }
}

testEmail();