// models/User.js - Defines the schema for the users collection in MongoDB

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can register with the same email
    },
    password: {
        type: String,
        required: true, // This will store the hashed password, not the plain text one
    },
    avatar: {
        type: String, // URL to the user's avatar image
    },
    created_at: {
        type: Date,
        default: Date.now, // Automatically sets the creation date
    },
});

// Create and export the model so it can be used in other files (like authController.js)
module.exports = mongoose.model('User', UserSchema);
