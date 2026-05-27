// Vercel Serverless Function to proxy all OpenWeatherMap API calls securely
export default async function handler(req, res) {
  const { endpoint, lat, lon, q, limit } = req.query;
  
  // Retrieve secure environment variables on Vercel, with fallback to their key
  const apiKey = process.env.API_KEY || "e301e76642e5894f2182a3398948469c";

  // Set standard CORS headers to permit static client fetches
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (!endpoint) {
    return res.status(400).json({ error: "Missing required 'endpoint' parameter" });
  }

  let url = "";

  if (endpoint === "direct") {
    url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit || 1}&appid=${apiKey}`;
  } else if (endpoint === "reverse") {
    url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit || 1}&appid=${apiKey}`;
  } else if (endpoint === "weather") {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  } else if (endpoint === "aqi") {
    url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  } else if (endpoint === "forecast") {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  } else {
    return res.status(400).json({ error: `Invalid endpoint: '${endpoint}'` });
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).json({ error: `OpenWeatherMap responded with status ${response.status}` });
    }
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Server error proxying meteorological request" });
  }
}
