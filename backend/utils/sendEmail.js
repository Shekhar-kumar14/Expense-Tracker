const nodemailer = require("nodemailer");

// Uses Gmail SMTP. In your .env set:
// EMAIL_USER=youremail@gmail.com
// EMAIL_PASS=your_16_char_gmail_app_password  (NOT your normal gmail password)
// Generate an App Password from: Google Account -> Security -> 2-Step Verification -> App Passwords

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Force IPv4 - some hosts (like Render's free tier) can't reach Gmail over IPv6
  family: 4,
});

const sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: `"Expense Tracker" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error.message);
    return false;
  }
};

module.exports = sendEmail;
