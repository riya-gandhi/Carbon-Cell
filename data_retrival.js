// Import required modules
const express = require("express");
const axios = require("axios");

// Initialize Express app
const app = express();

// Base URL of the public API
const API_BASE_URL = "https://api.publicapis.org";

// API endpoint to fetch data with filtering options
app.get("/api/entries", async (req, res) => {
  try {
    const category = req.query.category;
    const limit = req.query.limit || 10; // Default limit to 10 if not provided
    const apiUrl = `${API_BASE_URL}/entries${
      category ? `?category=${category}` : ""
    }`;

    // Fetch data from the public API
    const response = await axios.get(apiUrl);

    // Filter results based on limit
    const filteredData = response.data.entries.slice(0, limit);

    res.json(filteredData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
