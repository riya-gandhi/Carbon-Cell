// Import required modules
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Dummy database to store users
const users = [];

// Secret key for JWT
const JWT_SECRET_KEY = "your_secret_key";

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send("User registered successfully");
  } catch {
    res.status(500).send("Failed to register user");
  }
});

// Login route
app.post("/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.username);
  if (user == null) return res.status(400).send("User not found");
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const accessToken = jwt.sign({ username: user.username }, JWT_SECRET_KEY);
      res.json({ accessToken: accessToken });
    } else {
      res.status(401).send("Invalid password");
    }
  } catch {
    res.status(500).send("Internal server error");
  }
});

// Protected route
app.get("/protected", authenticateToken, (req, res) => {
  res.send("Access granted to protected route");
});

// Logout route (optional)
// In JWT, there is no server-side logout mechanism as the token is self-contained.
// However, you can have a client-side logout by clearing the token from the client.
// For example, on the frontend, clear the token from local storage or cookies.

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
