const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail", // or another service like SendGrid
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBookingConfirmation = async (email, event, paymentLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Booking Confirmation for ${event.title}`,
    text: `You have successfully booked ${event.title}.\n\nDetails:\nDate: ${event.date}\nTime: ${event.time}\n\nPay securely using this link: ${paymentLink}\n\nThank you!`,
  };

  await transporter.sendMail(mailOptions);
};
