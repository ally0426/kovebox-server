const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const getAllEvents = async (req, res) => {
  try {
    const { offset = 0, limit = 10, latitude, longitude, searchQuery } = req.query;

    console.log("Received query parameters:", { offset, limit, latitude, longitude, searchQuery });

    // Default query location
    let locationQuery = "United States";
    if (latitude && longitude) {
      locationQuery = `near ${latitude},${longitude}`;
    } else if (searchQuery) {
      locationQuery = searchQuery;
    }

    // Keywords for Korean events
    const keywords = [
      "Korean events",
      "K-pop events",
      "Korean cooking events",
      "Korean cultural events",
      "Korean language classes",
    ];

    const keywordQuery = keywords.map((keyword) => `"${keyword}"`).join(" OR ");
    const query = `${keywordQuery} ${locationQuery}`;

    // Fetch data from Google Custom Search API
    const response = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
      params: {
        key: process.env.GOOGLE_CUSTOM_SEARCH_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        start: parseInt(offset) + 1,
        num: parseInt(limit),
      },
    });

    const { items } = response.data;

    if (!items || !Array.isArray(items)) {
      console.error("No items found in the Google API response.");
      return res.status(404).json({ error: "No events found." });
    }

    // Map the response to event format
    const events = items.map((item) => {
      // Extract image with fallback
      let image = null;
      if (item.pagemap?.cse_image?.[0]?.src) {
        image = item.pagemap.cse_image[0].src;
      } else if (item.pagemap?.cse_thumbnail?.[0]?.src) {
        image = item.pagemap.cse_thumbnail[0].src;
      }

      // Extract location
      const address =
        item.pagemap?.metatags?.[0]?.["og:location"] || // From metadata
        item.pagemap?.metatags?.[0]?.["og:address"] || // Address field
        "Location unavailable";

      const formattedLocation = latitude && longitude
        ? `${address} (Lat: ${latitude}, Lng: ${longitude})`
        : address;

      // Extract time including "March" or "Mar" and AM/PM times
      const snippet = item.snippet || "";
      const dateRegex = /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?\d{1,2}(?:,\s?\d{4})?)\b/gi;
      const timeRegex = /\b(\d{1,2}:\d{2}\s?(AM|PM)|\d{1,2}\s?(AM|PM))\b/i;

      const dateMatch = snippet.match(dateRegex);
      const timeMatch = snippet.match(timeRegex);

      const time = dateMatch
        ? `${dateMatch[0]} ${timeMatch ? timeMatch[0] : ""}`.trim()
        : timeMatch
        ? timeMatch[0]
        : "Time not available";

      return {
        id: uuidv4(),
        title: item.title || "No title available",
        snippet: snippet || "No description available",
        image: image || "https://via.placeholder.com/300x200?text=No+Image+Available",
        contextLink: item.link || "https://example.com",
        location: formattedLocation,
        time: time,
      };
    });

    console.log("Mapped Events:", events);

    res.json(events);
  } catch (error) {
    console.error("Error in getAllEvents:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data || "No response data",
    });
    res.status(500).json({ error: "Failed to fetch events." });
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
