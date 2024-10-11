const Event = require("../models/eventModel");

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  const { title, category, date, time, location, price } = req.body;
  try {
    const event = new Event({
      title,
      category,
      date,
      time,
      location,
      price,
      approved: false, // Pending approval by default
    });
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to update event" });
  }
};
