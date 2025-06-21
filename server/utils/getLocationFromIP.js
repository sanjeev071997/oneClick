// utils/getLocationFromIP.js
import axios from "axios";


export const getLocationFromIP = async (ip) => {
  try {
    const token = "223469161b4d4b"; // Replace with your ipinfo.io token
    const response = await axios.get(`https://ipinfo.io/${ip}/json?token=${token}`);

    const { city, region, country, loc } = response.data;
    const [latitude, longitude] = loc.split(",");

    return {
      latitude,
      longitude,
      city,
      state: region,
      country,
    };
  } catch (err) {
    console.error("IP Lookup failed:", err.message);
    return null;
  }
};


// curl https://api.ipinfo.io/lite/8.8.8.8?token=223469161b4d4b
