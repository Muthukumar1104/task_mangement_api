const mongoose = require("mongoose");
require("dotenv").config();

let connection;

const connectDB = async () => {
  if (!connection) {
    try {
      connection = await mongoose.connect(
        "mongodb+srv://ksrmk437:roKuyWkDdOeXUm3H@cluster0.fjytmsi.mongodb.net/task_management",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      );
      console.log(`MongoDB connected:${mongoose.connection.host}`);
    } catch (err) {
      console.error("MongoDB connection failed", err);
      process.exit(1); // Exit the process with failure
    }
  }
  return connection;
};

module.exports = connectDB;
