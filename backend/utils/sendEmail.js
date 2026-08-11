const { Resend } = require("resend");

// Uses Resend HTTP API instead of SMTP (Render blocks outbound SMTP ports on free tier).
// In your .env / Render Environment set:
// RESEND_API_KEY=your_resend_api_key

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Expense Tracker <onboarding@resend.dev>", // apna verified domain hone par yahan replace kar dena
      to,
      subject,
      text,
    });

    if (error) {
      console.error("Email send error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send error:", error.message);
    return false;
  }
};

module.exports = sendEmail;
