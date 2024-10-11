const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  category: String,
  subcategory: String,
  date: String,
  time: String,
  location: String,
  price: Number,
  approved: { type: Boolean, default: false },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Event", eventSchema);
