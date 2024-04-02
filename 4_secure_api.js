// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Dummy secret key for JWT (replace with your actual secret key)
const JWT_SECRET_KEY = "your_secret_key";

// Dummy database to store users (replace with your actual user database)
const users = [
  { id: 1, username: "user1", password: "password1" },
  { id: 2, username: "user2", password: "password2" },
];

// Middleware function to verify JWT authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract JWT token from Authorization header

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token not provided" });
  }

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = user; // Attach the decoded user information to the request object
    next();
  });
};

// Example API endpoint restricted to authenticated users only
app.get("/protected", authenticateToken, (req, res) => {
  // Access the authenticated user information from req.user
  res.json({ message: `Hello, ${req.user.username}! You are authenticated.` });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
