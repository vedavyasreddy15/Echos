import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function test() {
  try {
    const info = await transporter.sendMail({
      from: `"Echos" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Echos Server",
      text: "If you are reading this, the email password is correct!"
    });
    console.log("Email sent successfully: " + info.messageId);
  } catch (err) {
    console.error("Failed to send email: ", err);
  }
}
test();
