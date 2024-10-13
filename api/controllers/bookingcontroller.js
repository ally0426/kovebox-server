const Event = require("../models/eventModel");
const Booking = require("../models/bookingModel");
const { sendBookingConfirmation } = require("../services/emailService");
const { sendSMSConfirmation } = require("../services/smsService");
const { createPaymentLink } = require("../services/paymentService");

exports.bookEvent = async (req, res) => {
  const { name, email, phone, eventId } = req.body;

  try {
    // Fetch the event details
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Create a new booking
    const booking = new Booking({
      eventId: event._id,
      userName: name,
      userEmail: email,
      userPhone: phone,
      paymentStatus: "Pending", // Payment will be pending until completed
    });

    await booking.save();

    // Generate a secure payment link (e.g., using Stripe/PayPal)
    const paymentLink = await createPaymentLink({
      eventId: event._id,
      amount: event.price,
      customerEmail: email,
    });

    // Send booking confirmation email and/or SMS with the payment link
    await sendBookingConfirmation(email, event, paymentLink);

    if (phone) {
      await sendSMSConfirmation(phone, event, paymentLink);
    }

    res
      .status(200)
      .json({
        message:
          "Booking successful. Check your email or text for payment details.",
      });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Failed to book event" });
  }
};
