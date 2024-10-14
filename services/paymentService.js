const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createPaymentLink = async ({ eventId, amount, customerEmail }) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Payment for event ${eventId}`,
          },
          unit_amount: amount * 100, // Stripe expects amounts in cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    customer_email: customerEmail,
  });

  return session.url; // Return the Stripe Checkout URL
};
