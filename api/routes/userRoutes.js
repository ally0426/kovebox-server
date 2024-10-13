const express = require("express");
const {
  createBooking,
  bookEvent,
  getUserBookings,
  getEventDetails,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

// Route to book an event
router.route("/book").post(createBooking);

// Route to get a user's bookings (protected route)
router.route("/bookings").get(protect, getUserBookings);

// Route to get event details by ID
router.route("/events/:id").get(getEventDetails);

module.exports = router;
