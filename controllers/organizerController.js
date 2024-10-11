const Event = require("../models/eventModel");

// Get events created by the organizer
exports.getOrganizerEvents = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const events = await Event.find({ organizer: organizerId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Create an event
exports.createOrganizerEvent = async (req, res) => {
  const { title, category, date, time, location, price } = req.body;
  try {
    const event = new Event({
      title,
      category,
      date,
      time,
      location,
      price,
      organizer: req.user._id, // Event tied to the organizer
      approved: false, // Pending admin approval
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
};
