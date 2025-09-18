// utils/mailer.js
import dotenv from "dotenv";
dotenv.config(); 
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

console.log("MAILTRAP_USER:", process.env.MAILTRAP_USER);


export const sendMail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({
      from: '"Job Portal" <no-reply@jobportal.com>',
      to,
      subject,
      text,
      html,
    });
    console.log("📩 Email sent:", subject, "to", to);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
};
