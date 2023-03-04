const mongoose = require("mongoose");
// Creating Mongodb URI in env file
const { MONGO_URI } = process.env;

const options = {
  autoIndex: false,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

mongoose
  .connect(MONGO_URI, options) // Trying to connect with database
  .then(() => {
    // If success
    console.log("Database connection successful");
  })
  .catch((err) => {
    // If fail
    console.log(`Database connection error: ${err}`);
  });

const db = mongoose.connection;

module.exports = db;
