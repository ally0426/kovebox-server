const Event = require("../models/eventModel");
const Booking = require("../models/bookingModel");
const { sendSms } = require("../services/twilioService");

// Book an event
exports.bookEvent = async (req, res) => {
  const { name, email, phone, eventId } = req.body;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const booking = new Booking({
      eventId: event._id,
      userName: name,
      userEmail: email,
      userPhone: phone,
    });

    // Send a confirmation SMS using Twilio
    await sendSms(
      phone,
      `Hello ${name}, your booking for event ${eventId} is confirmed!`
    );

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: "Failed to book event" });
  }
};

// Get user's bookings (protected route)
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// Get event details
exports.getEventDetails = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch event details" });
  }
};
