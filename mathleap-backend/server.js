// server.js - Main entry point for the backend with MongoDB connection

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Import MongoDB connection function
require('dotenv').config();

// Connect to Database
connectDB();

// Import routes
const authRoutes = require('./routes/auth');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);

// Server Startup
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
