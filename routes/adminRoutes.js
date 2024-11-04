const express = require("express");
const {
  fetchPendingEvents,
  approveEvent,
  rejectEvent,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/events/pending").get(protect, admin, fetchPendingEvents);
router.route("/events/approve/:id").put(protect, admin, approveEvent);
router.route("/events/reject/:id").delete(protect, admin, rejectEvent);

module.exports = router;
