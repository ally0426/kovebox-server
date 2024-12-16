const axios = require("axios");

const getNearbyCities = async (latitude, longitude) => {
  const radius = 100; // 100 miles
  const apiKey = process.env.GOOGLE_GEOCODING_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (!response.data.results || response.data.results.length === 0) {
      console.warn("No nearby cities found, returning default city.");
      return ["Los Angeles, CA"];
    }

    const cities = response.data.results
      .map((result) => result.formatted_address)
      .filter((address) => address.includes(","));

    console.log("Nearby Cities:", cities);
    return cities.slice(0, 5); // Return up to 5 nearby cities
  } catch (err) {
    console.error("Error fetching nearby cities:", err.message);
    return ["Los Angeles, CA"]; // Fallback to a default city
  }
};

module.exports = getNearbyCities;
