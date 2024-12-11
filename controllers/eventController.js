const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const eventDetailsCache = {};

const getAllEvents = async (req, res) => {
  try {
    const { offset = 0, limit = 10, latitude, longitude } = req.query;

    console.log("Received query parameters:", {
      offset,
      limit,
      latitude,
      longitude,
    });

    let locationQuery = "Los Angeles, CA";
    if (latitude && longitude) {
      if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
        locationQuery = `${latitude},${longitude}`;
      }
    }

    const keywords = [
      "Korean event",
      "K-pop event",
      "Korean cooking event",
      "Korean course event",
      "Korean language event",
    ];
    const keywordQuery = keywords.map((keyword) => `"${keyword}"`).join(" | "); // | instead of OR
    const query = `${keywordQuery} near ${locationQuery}`;
    console.log("Constructed query:", query);

    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: process.env.GOOGLE_CUSTOM_SEARCH_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: query,
          start: parseInt(offset) + 1,
          num: parseInt(limit),
        },
      }
    );

    console.log("Google API response:", response.data);

    const { items } = response.data;

    if (!items || !Array.isArray(items)) {
      console.error("No items found in the Google API response.");
      return res.status(404).json({ error: "404 error- No events found." });
    }

    // Generate UUID for each event
    const events = items.map((item) => {
      if (item.pagemap?.cse_image?.[0]?.src) {
        image = item.pagemap?.cse_image?.[0]?.src;
      } else if (item.pagemap?.cse_image) {
        image = item.pagemap?.cse_image[0].src;
      } else if (item.pagemap?.cse_thumbnail) {
        image = item.pagemap?.cse_thumbnail[0].src;
      } else if (item.link) {
        image = item.link;
      } else {
        const $ = cheerio.load(item.snippet);
        image = $("img").first().attr("src") || null;
      }
      console.log("Resolved image: ", image);

      return {
        id: uuidv4(), // Unique ID for each event
        title: item.title,
        snippet: item.snippet,
        image: image,
        contextLink:
          item.pagemap?.metatags?.[0]?.["og:url"] || // Extract Open Graph URL if available
          item.image?.contextLink || // Fallback to the main link
          item.displayLink ||
          "kovebox.com", // // Fallback toEnsure a fallback context link
      };
    });
    res.json(events); // Return all events
    console.log(`Mapped events: ${events}`);
  } catch (error) {
    console.error("Error fetching events: ", {
      message: error.message,
      stack: error.stack,
      response:
        error.response?.data || "No response data in eventController.js",
    });
    res.status(500).json({
      error: "500 error' Failed to fetch events in eventController.js",
    });
  }
};

// module.exports = { getAllEvents };

// Fetch event details by ID
const getEventDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the event is already cached
    if (eventDetailsCache[id]) {
      console.log(`Fetching event detail from cache for ID: ${id}`);
      return res.json(eventDetailsCache[id]);
    }

    // Assume we're using Google API to fetch event detail
    const response = await axios.get(
      `https://www.googleapis.com/customsearch/v1`,
      {
        params: {
          key: process.env.GOOGLE_CUSTOM_SEARCH_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: id, // Assuming ID is used as the query here
        },
      }
    );

    const { items } = response.data;

    if (!items || !Array.isArray(items)) {
      console.error("No event details found in the Google API response.");
      return res
        .status(404)
        .json({ error: "404 error- No event details found." });
    }
    res.status(200).json(events);

    const eventDetail = {
      title: items[0].title || "No title available",
      snippet: items[0].snippet || "No description available",
      link: items[0].link || "No link available",
      image:
        items[0].pagemap?.cse_image?.[0]?.src ||
        items[0].pagemap?.cse_image[0].src ||
        items[0].pagemap?.cse_thumbnail[0].src ||
        items[0].link ||
        null,
    };

    // Cache the event detail
    eventDetailsCache[id] = eventDetail;

    res.json(eventDetail);
  } catch (error) {
    console.error("Error in getEventDetail:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || "No response data",
    });
    res.status(500).json({ error: "500 error- Failed to fetch event detail." });
  }
};

module.exports = { getAllEvents, getEventDetail };

// const Event = require("../models/eventModel");

// // Get all events
// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: "500 error- Failed to fetch events" });
//   }
// };

// // Create a new event
// exports.createEvent = async (req, res) => {
//   const { title, category, date, time, location, price } = req.body;
//   try {
//     const event = new Event({
//       title,
//       category,
//       date,
//       time,
//       location,
//       price,
//       approved: false, // Pending approval by default
//     });
//     const savedEvent = await event.save();
//     res.status(201).json(savedEvent);
//   } catch (error) {
//     res.status(500).json({ message: "500 error- Failed to create event" });
//   }
// };

// // Update an event
// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!event) return res.status(404).json({ message: "404 error- Event not found" });
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: "500 error- Failed to update event" });
//   }
// };
