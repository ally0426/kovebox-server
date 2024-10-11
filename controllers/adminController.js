const Event = require("../models/eventModel");

// Get all pending events for admin approval
exports.fetchPendingEvents = async (req, res) => {
  try {
    const pendingEvents = await Event.find({ approved: false });
    res.json(pendingEvents);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending events" });
  }
};

// Approve an event
exports.approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    event.approved = true;
    await event.save();
    res.json({ message: "Event approved" });
  } catch (error) {
    res.status(500).json({ message: "Failed to approve event" });
  }
};

// Reject an event
exports.rejectEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event rejected and deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to reject event" });
  }
};
