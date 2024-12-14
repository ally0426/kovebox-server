const axios = require("axios");

const getNearbyCities = async (latitude, longitude) => {
  const radius = 100; // 100 miles
  const apiKey = process.env.GOOGLE_GEOCODING_KEY;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const cities = response.data.results.map((result) => result.formatted_address);
    console.log("Nearby Cities:", cities);
    return cities;
  } catch (err) {
    console.error("Error fetching nearby cities:", err.message);
    return ["Los Angeles, CA"]; // Fallback to a default city
  }
};

module.exports = getNearbyCities;
