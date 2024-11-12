const transporter = require('../config/nodemailer');

// Function to send OTP via email
const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL, // Your email from .env
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`, // You can customize the message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendOTP;
