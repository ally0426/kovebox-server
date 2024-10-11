const express = require("express");
const {
  scrapeEventbrite,
  // scrapeMeetup,
} = require("../controllers/scrapingController");

const router = express.Router();
console.log("scraping routes loaded in scrapingRoutes.js...");

router.get("/scrape/eventbrite", scrapeEventbrite);
// router.get("/scrape/meetup", scrapeMeetup);

module.exports = router;
