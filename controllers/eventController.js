const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");

const GOOGLE_CUSTOM_SEARCH_KEY = process.env.GOOGLE_CUSTOM_SEARCH_KEY;
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

let eventDetailsCache = [];

// Define keywords for the query
const keywords = [
  "Korean event",
  "K-pop",
  "Korean cooking",
  "Korean course",
  "Korean language",
];

// fetch all events
const getAllEvents = async (req, res) => {
  try {
    // Ensure default values for offset, limit, latitude, and longitude
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const latitude = req.query.latitude || null;
    const longitude = req.query.longitude || null
    
    // Validate latitude and longitude
    let locationQuery = "Los Angeles, CA"; // Default location
    console.log(
      `Received latitude and longitude: ${latitude} and ${longitude}`
    );

    if (latitude && longitude) {
      if (!isNaN(parseFloat(latitude)) && !isNaN(parseFloat(longitude))) {
        locationQuery = `${latitude},${longitude}`;
        console.log("Valid location detected: ", locationQuery);
      } else {
        console.warn(
          "Invalid latitude/longitude provided. Falling back to default location."
        );
      }
    } else {
      console.warn(
        "Missing latitude/longitude. Falling back to default location."
      );
    }

    // Construct the query string
    const keywordQuery = keywords.map((keyword) => `"${keyword}"`).join(" OR ");
    const query = `${keywordQuery} near ${locationQuery}`
      ||
      "Korean events in Los Angeles, CA this weekend"; // default query
    console.log(
      `Fetching events with query: ${query}, offset: ${offset}, limit: ${limit}`
    );
    const response = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: GOOGLE_CUSTOM_SEARCH_KEY,
          cx: GOOGLE_SEARCH_ENGINE_ID,
          q: query,
          start: parseInt(offset) + 1, // Custom Search API uses 1-based indexing
          num: parseInt(limit),
        },
      }
    );
    console.log(`query in eventController.js: ${query}`);
    const { items } = response.data;
    console.log(
      `Google API response in eventController.js: ${JSON.stringify(response.data, null, 2)}`
    );
    if (!items || items.length === 0) {
      return res.status(404).json({ error: "No events found " });
    }

    console.log(
      `items in eventController.js: ${JSON.stringify(items, null, 2)}`
    );

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

      // Create an event object
      const event = {
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
      eventDetailsCache.push(event);
      return event;
    });
    res.json(events); // Return all events
  } catch (error) {
    console.error("Error fetching events: ", {
      message: error.message,
      stack: error.stack,
      response:
        error.response?.data || "No response data in eventController.js",
    });
    res
      .status(500)
      .json({ error: "Failed to fetch events in eventController.js" });
  }
};

// module.exports = { getAllEvents };

// Fetch event details by ID
const getEventDetail = async (req, res) => {
  const { id } = req.params;
  console.log(`id in eventController.js: ${id}`);

  const event = eventDetailsCache.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not Found" });
  }
  res.json(event);

  //   return res.status(400).json({ error: "Event ID is required" });
  // }

  // try {
  //   // Build the query string
  //   const query = `${keywords.join(" | ")} ${id}`;
  //   console.log(`query in eventController.js: ${query}`);

  //   // Use Google Custom Search API to get the event details
  //   const response = await axios.get(
  //     `https://www.googleapis.com/customsearch/v1`,
  //     {
  //       params: {
  //         key: GOOGLE_CUSTOM_SEARCH_KEY,
  //         cx: GOOGLE_SEARCH_ENGINE_ID,
  //         q: query, // Add Korean event from the first match, Assuming the event ID or unique identifier is searchable
  //       },
  //     }
  //   );

  //   const { items } = response.data;
  //   console.log(
  //     `response.data.items in eventController.js: ${response.data.items}`
  //   );

  //   if (!items || items.length === 0) {
  //     return res.status(404).json({ error: "Event not found" });
  //   }

  //   // Extract the first matching event
  //   const event = items[0];

  //   const eventData = {
  //     id: event.cacheId || id, // Fallback to `id` if `cacheId` is unavailable
  //     title: event.title,
  //     snippet: event.snippet,
  //     image:
  //       event.pagemap?.cse_image || event.pagemap?.cse_thumbnail || event.link,
  //     contextLink:
  //       event.item.pagemap?.metatags?.[0]?.["og:url"] || // Extract Open Graph URL if available
  //       event.image?.contextLink || // Fallback to the main link
  //       event.displayLink ||
  //       "kovebox.com", // // Fallback toEnsure a fallback context link
  //   };

  //   console.log(`Constructed Query in eventController.js: Korean event ${id}`);

  //   res.json(eventData);
  //   console.log(
  //     `eventData in eventController.js: ${JSON.stringify(eventData, null, 2)}`
  //   );
  // } catch (error) {
  //   console.error("Error fetching event details:", error.message);
  //   res.status(500).json({ error: "Failed to fetch event details" });
  // }
};

module.exports = { getAllEvents, getEventDetail };

// const Event = require("../models/eventModel");

// // Get all events
// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch events" });
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
//     res.status(500).json({ message: "Failed to create event" });
//   }
// };

// // Update an event
// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!event) return res.status(404).json({ message: "Event not found" });
//     res.json(event);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update event" });
//   }
// };
