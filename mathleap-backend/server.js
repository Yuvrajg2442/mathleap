// server.js - Main entry point for the backend

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// This MUST come before the routes are defined
// Enable Cross-Origin Resource Sharing to allow frontend requests
app.use(cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true
}));
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");

// --- API Routes ---
// All user-related routes will be prefixed with /api/users
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/users", userRoutes);

// --- Database Connection and Server Startup ---
connectDB()
  .then(() => {
    // Only start server after DB connection is established
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // This catch is mostly for safety—connectDB already exits on failure.
    console.error(err);
    process.exit(1);
  });
