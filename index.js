// 1.
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const scrapingController = require("./controllers/scrapingController");

dotenv.config();

const app = express();
app.use(express.json());

// OAuth routes for Eventbrite (if needed)
app.use("/api/auth", authRoutes);

// Route to fetch combined Google and Eventbrite events based on location
app.get("/api/events", async (req, res) => {
  const lat = req.query.lat || 34.0522; // Default to Los Angeles, CA
  const lng = req.query.lng || -118.2437;

  try {
    const events = await scrapingController.fetchAllEvents(lat, lng);
    res.json(events);
  } catch (error) {
    console.error("Error fetching combined events:", error);
    res.status(500).json({ error: "Error fetching combined events" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// 2.
// const express = require("express");
// const dotenv = require("dotenv");
// const authRoutes = require("./routes/authRoutes");
// const scrapingController = require("./controllers/scrapingController");
// const cors = require("cors");
// dotenv.config();

// const app = express();
// app.use(express.json());

// // OAuth routes for Google
// app.use("/api/auth", authRoutes);

// // Route to fetch combined Google and Eventbrite events based on location
// app.get("/api/events", async (req, res) => {
//   const googleAccessToken = req.query.access_token;
//   const lat = req.query.lat || 34.0522; // Default to Los Angeles, CA
//   const lng = req.query.lng || -118.2437;

//   if (!googleAccessToken) {
//     return res.status(401).json({
//       error:
//         "Google access token not provided. Please authenticate via /api/auth/google",
//     });
//   }

//   try {
//     const events = await scrapingController.fetchAllEvents(
//       googleAccessToken,
//       lat,
//       lng
//     );
//     res.json(events);
//   } catch (error) {
//     console.error("Error fetching combined events:", error);
//     res.status(500).json({ error: "Error fetching combined events" });
//   }

// // Log requests for debugging
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//      ["https://kovebox.com", "https://www.kovebox.com"]
//   );
//   console.log(`${req.method} ${req.url} - ${req.ip}`);
//   next();
// });

// // Start the server
// const PORT = process.env.PORT || 5000;

// // Configure CORS
// app.use(
//   cors({

//     origin: ["https://kovebox.com", "https://www.kovebox.com"],
//     allowedHeaders: "Content-Type",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Enable this if your API uses cookies
//   })
// );

// // Initialize Twilio client
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // Middleware
// app.use(express.json());
// // app.use(cors());
// app.use(helmet()); // Adding security headers

// // API Routes
// app.use("/api", scrapingRoutes);
// app.use("/api/organizer", organizerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/events", eventRoutes); // Plural form for REST convention
// app.use("api/book", bookingRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found with 404 ERROR" });
// });

// // Test route
// app.get("/api", (req, res) => {
//   res.json({ message: "Welcome to the Kovebox API!" });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error: ", err);
//   res
//     .status(500)
//     .json({ message: "Internal Server Error", error: err.message });
// });

// // Sample route to send an SMS
// app.post("/send-sms", async (req, res) => {
//   const { phone, message } = req.body;
//   try {
//     const sentMessage = await client.messages.create({
//       body: message,
//       from: "+16127031417", // Your Twilio phone number
//       to: phone, // Recipient phone number
//     });
//     res.status(200).json({ messageId: sentMessage.sid });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send SMS" });
//   }
// });

// // MongoDB Connection using environment variable for security
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });

// // 404 Error Handling for Unhandled Routes
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Centralized Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error("Server ERROR: ", err);
//   // console.error(err.stack);
//   res.status(500).json({ message: "Oh~~~~An internal error occurred" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// 3.
// require("dotenv").config(); // For environment variables
// const express = require("express");
// const mongoose = require("mongoose");
// const scrapingRoutes = require("./routes/scrapingRoutes");
// const bookingRoutes = require("./routes/bookingRoutes");
// const eventRoutes = require("./routes/eventRoutes");
// const organizerRoutes = require("./routes/organizerRoutes");
// const adminRoutes = require("./routes/adminRoutes");
// const paymentRoutes = require("./routes/paymentRoutes");

// const cors = require("cors"); // For cross-origin requests
// const helmet = require("helmet"); // For security headers
// const twilio = require("twilio");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Log requests for debugging
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", [process.env.CLIENT_URL]);
//   console.log(`${req.method} ${req.url} - ${req.ip}`);
//   next();
// });

// // Configure CORS
// app.use(
//   cors({
//     //origin: "*",
//     // origin: ["https://kovebox-client-iota.vercel.app"],
//     origin: "http://localhost:3000",
//     // origin: ["https://kovebox-client-iota.vercel.app", process.env.CLIENT_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true, // Enable this if your API uses cookies
//   })
// );

// // Initialize Twilio client
// const client = twilio(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );

// // Middleware
// app.use(express.json());
// // app.use(cors());
// app.use(helmet()); // Adding security headers

// // API Routes
// app.use("/api", scrapingRoutes);
// app.use("/api/organizer", organizerRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/events", eventRoutes); // Plural form for REST convention
// app.use("/api/booking", bookingRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found with 404 ERROR" });
// });

// // Test route
// app.get("/api", (req, res) => {
//   res.json({ message: "Welcome to the Kovebox API!" });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error("Error: ", err);
//   res
//     .status(500)
//     .json({ message: "Internal Server Error", error: err.message });
// });

// // Sample route to send an SMS
// app.post("/send-sms", async (req, res) => {
//   const { phone, message } = req.body;
//   try {
//     const sentMessage = await client.messages.create({
//       body: message,
//       from: "+16127031417", // Your Twilio phone number
//       to: phone, // Recipient phone number
//     });
//     res.status(200).json({ messageId: sentMessage.sid });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send SMS" });
//   }
// });

// // MongoDB Connection using environment variable for security
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("Connected to MongoDB");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection error:", error);
//   });

// // 404 Error Handling for Unhandled Routes
// app.use((req, res, next) => {
//   res.status(404).json({ message: "Route not found" });
// });

// // Centralized Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error("Server ERROR: ", err);
//   // console.error(err.stack);
//   res.status(500).json({ message: "Oh~~~~An internal error occurred" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
