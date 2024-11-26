const express = require("express");
const {
  getAllEvents,
  getEventDetail,
} = require("../controllers/eventController");

const router = express.Router();

// Route to fetch all events
router.get("/", getAllEvents); // events route

// Route to fetch an event with id
router.get("/:id", getEventDetail); // events/:id route (maybe need to update from event/:id)

module.exports = router;

// const express = require("express");
// const Event = require("../models/eventModel"); // Assuming Event model is in models directory
// const router = express.Router();

// // Route to get all events with sorting
// router.get("/events", async (req, res) => {
//   try {
//     const { sortBy } = req.query; // Get the sorting type from query params
//     let events = await Event.find(); // Fetch all events

//     // Apply sorting logic
//     if (sortBy === "date") {
//       events = events.sort((a, b) => new Date(a.date) - new Date(b.date));
//     } else if (sortBy === "price") {
//       events = events.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
//     } else if (sortBy === "category") {
//       events = events.sort((a, b) => a.category.localeCompare(b.category));
//     }

//     // Return the sorted events
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching events" });
//   }
// });

// router.post("/events", async (req, res) => {
//   const { title, category, date, time, location, price } = req.body;

//   try {
//     const event = new Event({
//       title,
//       category,
//       date,
//       time,
//       location,
//       price,
//     });

//     const savedEvent = await event.save(); // Save the new event to MongoDB
//     res.status(201).json(savedEvent);
//   } catch (error) {
//     res.status(500).json({ message: "Error creating event" });
//   }
// });

// module.exports = router;
