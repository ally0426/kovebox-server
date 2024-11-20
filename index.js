const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  fetchGoogleCustomSearchResults,
} = require("./controllers/scrapingController");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["https://kovebox.com", "https://www.kovebox.com"],
  })
);
app.use(express.json());

// Route for Google Custom Search
app.get("/api/search", fetchGoogleCustomSearchResults);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ error: "The path you requested does not exist." });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const scrapingController = require("./controllers/scrapingController");

// dotenv.config();

// const app = express();
// app.use(express.json());

// // CORS configuration to allow requests from your client domain
// app.use(
//   cors({
//     origin: ["https://kovebox.com", "https://www.kovebox.com"],
//   })
// );

// // Route to fetch Google event search results based on location, with pagination
// app.get("/api/events", async (req, res) => {
//   //   const lat = req.query.lat || 45.5126; // Default to Minneapolis, MN
//   //   const lng = req.query.lng || -4.4904;
//   const lat = req.query.lat || 34.0522; // Default to Los Angeles, CA
//   const lng = req.query.lng || -118.2437;
//   const limit = parseInt(req.query.limit, 10) || 20; // Default to 20 results per page
//   const offset = parseInt(req.query.offset, 10) || 0; // Default to starting from the first result

//   try {
//     const events = await scrapingController.fetchAllEvents(
//       lat,
//       lng,
//       limit,
//       offset
//     );
//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ error: "Error fetching events" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const scrapingController = require("./controllers/scrapingController");

// dotenv.config();

// const app = express();
// app.use(express.json());

// // CORS configuration to allow requests from your client domain
// app.use(
//   cors({
//     origin: ["https://kovebox.com", "https://www.kovebox.com"],
//   })
// );

// // Route to fetch Google event search results based on location
// app.get("/api/events", async (req, res) => {
//   const lat = req.query.lat || 34.0522; // Default to Los Angeles, CA
//   const lng = req.query.lng || -118.2437;

//   try {
//     const events = await scrapingController.fetchAllEvents(lat, lng);
//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ error: "Error fetching events" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const scrapingController = require("./controllers/scrapingController");

// dotenv.config();

// const app = express();

// // Middleware to parse JSON requests
// app.use(express.json());

// // Set up CORS to allow requests from your client
// app.use(
//   cors({
//     origin: ["https://kovebox.com", "https://www.kovebox.com"], // Allow requests from these origins
//   })
// );

// // Route to fetch combined events
// app.get("/api/events", async (req, res) => {
//   const lat = req.query.lat || 34.0522; // Default latitude (Los Angeles)
//   const lng = req.query.lng || -118.2437; // Default longitude (Los Angeles)

//   try {
//     const events = await scrapingController.fetchAllEvents(lat, lng);
//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({ error: "Error fetching events" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
