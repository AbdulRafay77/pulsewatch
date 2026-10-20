require("dotenv").config();

const app = require("./app.js");
const connectDB = require("./config/db.js");
const {
  startMonitorScheduler
} = require("./services/monitorScheduler.js");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startMonitorScheduler();
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );

    process.exit(1);
  }
}

startServer();