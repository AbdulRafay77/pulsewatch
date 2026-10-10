const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db.js");
const monitorRoutes = require("./modules/monitors/monitor.routes.js");
const {
  startMonitorScheduler
} = require("./services/monitorScheduler.js");
const incidentRoutes = require("./modules/incidents/incident.routes.js");

const authRoutes =
  require("./modules/auth/auth.routes.js");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.use("/api/monitors", monitorRoutes);
app.use("/api/incidents", incidentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PulseWatch API is running"
  });
});

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