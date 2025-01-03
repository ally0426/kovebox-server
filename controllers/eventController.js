const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

// Fetch all events
const getAllEvents = async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 30,
      latitude,
      longitude,
      searchQuery,
    } = req.query;

    // Build the query
    let locationQuery = "United States";
    if (latitude && longitude) {
      locationQuery = `near ${latitude},${longitude}`;
    } else if (searchQuery) {
      locationQuery = searchQuery;
    }

    // Keywords for events
    const keywords = [
      "Korean events",
      "K-pop events",
      "Korean cooking events",
      "Korean cultural events",
      "Korean language classes",
    ];
    const keywordQuery = keywords.map((keyword) => `"${keyword}"`).join(" OR ");
    const query = `${keywordQuery} ${locationQuery}`;

    console.log("Constructed query:", query);

    // Fetch data from Google Custom Search API
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

    const { items } = response.data;

    if (!items || !Array.isArray(items)) {
      console.error("No items found in the Google API response.");
      return res.status(404).json({ error: "No events found." });
    }

    // Map API response to event format
    const events = items.map((item) => {
      // Extract image
      let image = null;
      // Extract image
      if (item.pagemap?.cse_image?.[0]?.src) {
        image = item.pagemap.cse_image[0].src;
      } else if (item.pagemap?.cse_thumbnail?.[0]?.src) {
        image = item.pagemap.cse_thumbnail[0].src;
      }

      // Extract location
      const address =
        item.pagemap?.metatags?.[0]?.["og:location"] ||
        item.pagemap?.metatags?.[0]?.["og:address"] ||
        item.pagemap?.metatags?.[0]?.["og:region"] ||
        "Location unavailable";

      const formattedLocation =
        latitude && longitude
          ? `${address} (Lat: ${latitude}, Lng: ${longitude})`
          : address;

      // Extract time
      const snippet = item.snippet || "";
      const dateRegex =
        /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s?\d{1,2}(?:,\s?\d{4})?)\b/gi;
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
        image:
          image ||
          "https://via.placeholder.com/300x200?text=No+Image+Available",
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
    res.status(500).json({ error: "500 error - Failed to fetch events." });
  }
};

module.exports = { getAllEvents };
// Fetch event detail by ID
const getEventDetail = async (req, res) => {
  try {
    const { id } = req.params;
    // Example: Replace with actual logic to fetch event details
    const event = {
      id,
      title: "Sample Event Title",
      snippet: "This is a sample event description.",
      image: "https://via.placeholder.com/300x200?text=Event+Image",
      contextLink: "https://example.com",
      location: "Sample Location",
      time: "Sample Time",
    };
    res.json(event);
  } catch (error) {
    console.error("Error in getEventDetail:", error.message);
    res.status(500).json({
      error: "500 Error - Failed to fetch event details by event ID.",
    });
  }
};
module.exports = { getAllEvents, getEventDetail };
