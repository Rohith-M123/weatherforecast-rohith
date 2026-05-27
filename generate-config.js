const fs = require('fs');

// Read the API Key from Vercel Environment variables, fallback to their key
const apiKey = process.env.API_KEY || "e301e76642e5894f2182a3398948469c";

// Compile static config file contents
const fileContent = `// Generated dynamically during Vercel Build Step
const API_KEY = "${apiKey}";
`;

// Write the file locally in the Vercel build container
fs.writeFileSync('config.js', fileContent);
console.log('config.js compiled successfully for static deployment!');
