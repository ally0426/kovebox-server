const axios = require("axios");

const fetchGeolocation = async (req, res) => {
  const { lat, lon } = req.query; // Expect latitude and longitude from client
  const apiKey = process.env.GOOGLE_GEOCODING_API_KEY;

  if (!lat || !lon) {
    return res
      .status(400)
      .json({ error: "Latitude and longitude are required" });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lon}`,
          key: apiKey,
        },
      }
    );

    const { results, status } = response.data;

    if (status === "OK" && results.length > 0) {
      const components = results[0].address_components;

      // Prefer locality or fallback to neighborhood or administrative_area_level_2
      const city =
        components.find((c) => c.types.includes("locality"))?.long_name ||
        components.find((c) => c.types.includes("neighborhood"))?.long_name ||
        components.find((c) => c.types.includes("administrative_area_level_2"))
          ?.long_name ||
        "Unknown City";
      const state =
        components.find((c) => c.types.includes("administrative_area_level_1"))
          ?.short_name || "Unknown State";
      console.log(`city, state: ${city}, ${state}`);
      return res.json({ city, state });
    } else {
      return res.status(404).json({ error: "No location data found" });
    }
  } catch (err) {
    console.error("Error fetching geolocation:", err.message);
    return res.status(500).json({ error: "Failed to fetch location" });
  }
};

module.exports = { fetchGeolocation };
