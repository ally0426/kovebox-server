const express = require("express");
const { bookEvent } = require("../controllers/bookingController");
const router = express.Router();

// Route for booking an event without login
router.post("/book", bookEvent);

module.exports = router;
