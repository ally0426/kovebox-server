const express = require("express");
const {
  createOrganizerEvent,
  getOrganizerEvents,
} = require("../controllers/organizerController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/create").post(protect, createOrganizerEvent);
router.route("/events").get(protect, getOrganizerEvents);

module.exports = router;
