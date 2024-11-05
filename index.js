const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const scrapingController = require("./controllers/scrapingController");

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Set up CORS to allow requests from your client
app.use(
  cors({
    origin: ["https://kovebox.com", "https://www.kovebox.com"], // Allow requests from these origins
  })
);

// Route to fetch combined events
app.get("/api/events", async (req, res) => {
  const lat = req.query.lat || 34.0522; // Default latitude (Los Angeles)
  const lng = req.query.lng || -118.2437; // Default longitude (Los Angeles)

  try {
    const events = await scrapingController.fetchAllEvents(lat, lng);
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Error fetching events" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
