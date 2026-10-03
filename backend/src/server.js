const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const monitorRoutes = require("./modules/monitors/monitor.routes.js");

dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173"
  })
);

app.use(express.json());

app.use("/api/monitors", monitorRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "PulseWatch API is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});