const mongoose = require('mongoose');

// Keeps a single connection alive for the app's lifetime. Mongoose queues
// queries until the connection is ready, so routes don't need to wait on this.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
