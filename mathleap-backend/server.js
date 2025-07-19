// server.js - Main entry point for the backend

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();
console.log('MONGO_URI:', process.env.MONGO_URI);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// This MUST come before the routes are defined
// Enable Cross-Origin Resource Sharing to allow frontend requests
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// Import routes
const userRoutes = require("./routes/users"); // Changed from authRoutes


// --- API Routes ---
// All user-related routes will be prefixed with /api/users
app.use("/api/users", userRoutes); // Changed from /api/auth


// --- Database Connection and Server Startup ---
connectDB()
    .then(() => {
        // Only start server after DB connection is established
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
.catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});
