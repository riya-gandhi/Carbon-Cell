const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Dummy database to store users
const users = [];

// Secret key for JWT
const JWT_SECRET_KEY = "riya_gandhi_secret_key"; // ENVIRONMENT VARIABLE

// Function to register a new user
async function register(username, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username: username, password: hashedPassword };
    users.push(user);
    return "User registered successfully";
  } catch {
    throw new Error("Failed to register user");
  }
}

// Function to handle user login
async function login(username, password) {
  const user = users.find((user) => user.username === username);
  if (!user) throw new Error("User not found");

  try {
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ username: user.username }, JWT_SECRET_KEY);
      return { accessToken: accessToken };
    } else {
      throw new Error("Invalid password");
    }
  } catch {
    throw new Error("Internal server error");
  }
}

// Function to verify JWT token
function authenticateToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
      if (err) reject("Invalid token");
      resolve(decoded);
    });
  });
}

// Example usage:
async function testAuthentication(token) {
  try {
    const user = await authenticateToken(token);
    console.log("Authenticated user:", user);
  } catch (error) {
    console.error("Authentication failed:", error);
  }
}

async function test() {
  const registerResponse = await register("testuser", "testpassword");
  console.log(registerResponse);

  try {
    const loginResponse = await login("testuser", "testpassword");
    console.log(loginResponse);

    const accessToken = loginResponse.accessToken;
    await testAuthentication(accessToken);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

test();
