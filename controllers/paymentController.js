// controllers/paymentController.js
require("dotenv").config(); // Load environment variables

const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Function to create a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;

    // Create a payment intent with the specified amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in the smallest currency unit (e.g., cents)
      currency: currency, // Currency code (e.g., 'usd')
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
};
