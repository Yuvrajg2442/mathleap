
// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Mongoose 6+ automatically uses the new URL parser and unified topology internally,
    // so you don’t need to pass those options any more.
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
