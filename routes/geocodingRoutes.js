const express = require("express");
const { fetchGeolocation } = require("../controllers/geocodingController");

const router = express.Router();

router.get("/geolocation", fetchGeolocation);

module.exports = router;
