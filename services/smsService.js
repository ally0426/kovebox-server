const twilio = require("twilio");
const client = new twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

exports.sendSMSConfirmation = async (phone, event, paymentLink) => {
  await client.messages.create({
    body: `Booking confirmation for ${event.title}. Pay securely using this link: ${paymentLink}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
};
