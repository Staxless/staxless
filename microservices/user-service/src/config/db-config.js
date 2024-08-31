const mongoose = require("mongoose");

const DATABASE_NAME = "database";

function connectDB() {
  const url = `mongodb://mongodb-service:27017/${DATABASE_NAME}`;

  try {
    mongoose.connect(url, {});
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected: ${url}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
}

module.exports = connectDB;
