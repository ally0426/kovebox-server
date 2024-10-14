// services/twilioService.js
require("dotenv").config(); // Load environment variables

const twilio = require("twilio");

// Initialize Twilio client with credentials from the .env file
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Function to send SMS
const sendSms = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: "+1234567890", // Twilio phone number
      to: to, // Recipient phone number
    });
    console.log(`Message sent: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
};

module.exports = { sendSms };
