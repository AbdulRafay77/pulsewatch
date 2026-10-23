require("dotenv").config({ quiet: true });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes.js");
const userRoutes = require("./modules/users/user.routes.js");
const notificationRoutes = require("./features/notifications/notification.routes.js");
const monitorRoutes = require("./modules/monitors/monitor.routes.js");
const incidentRoutes = require("./modules/incidents/incident.routes.js");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173"
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked origin: ${origin}`)
      );
    },
    credentials: true
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/monitors", monitorRoutes);
app.use("/api/incidents", incidentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PulseWatch API is running"
  });
});

module.exports = app;