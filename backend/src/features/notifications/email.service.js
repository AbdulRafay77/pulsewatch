const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail({
  to,
  subject,
  text,
  html
}) {
  return transporter.sendMail({
    from:
      process.env.EMAIL_FROM ||
      process.env.EMAIL_USER,

    to,
    subject,
    text,
    html
  });
}

async function verifyEmailConnection() {
  return transporter.verify();
}

module.exports = {
  sendEmail,
  verifyEmailConnection
};