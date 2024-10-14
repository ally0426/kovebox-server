const express = require("express");
const { createBooking } = require("../controllers./bookingController");
const router = express.Router();

// Route for booking an event without login
router.post("/book", createBooking);

module.exports = router;
