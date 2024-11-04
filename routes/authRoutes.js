const express = require("express");
const axios = require("axios");
const querystring = require("querystring");

const router = express.Router();

// Redirect the user to Google for authorization
router.get("/google", (req, res) => {
  const authorizationUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&response_type=code&scope=https://www.googleapis.com/auth/calendar.events.readonly&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&access_type=offline`;
  res.redirect(authorizationUrl);
});

// Handle the callback from Google
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" });
  }

  try {
    // Exchange the authorization code for an access token
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Save or use the access token as needed
    res.json({ access_token });
  } catch (error) {
    console.error(
      "Error exchanging authorization code for Google access token:",
      error
    );
    res.status(500).json({ error: "Failed to obtain Google access token" });
  }
});

module.exports = router;
