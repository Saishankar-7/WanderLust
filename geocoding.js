const axios = require('axios');
const API_KEY = process.env.MAP_API_KEY;

async function geocodeLocation(location) {
  try {
    const encodedLocation = encodeURIComponent(location);
    const url = `https://api.maptiler.com/geocoding/${encodedLocation}.json`;

    const response = await axios.get(url, {
      params: {
        key: API_KEY
      }
    });

    if (!response.data.features || response.data.features.length === 0) {
      console.error('❌ No matching location found for:', location);
      return null;
    }

    const [lng, lat] = response.data.features[0].geometry.coordinates;
    return { lat, lng };
  } catch (err) {
    console.error('❌ Geocoding error:', err.message);
    return null;
  }
}

module.exports = geocodeLocation;
