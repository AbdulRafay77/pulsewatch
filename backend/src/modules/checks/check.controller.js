const checkService = require("./check.service");

async function runMonitorCheck(req, res) {
  try {
    const result = await checkService.runMonitorCheck(
      req.params.id
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Monitor check error:", error);

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({
      message:
        error.statusCode
          ? error.message
          : "Failed to check monitor"
    });
  }
}

async function getChecksByMonitor(req, res) {
  try {
    const checks = await checkService.getChecksByMonitor(
      req.params.id
    );

    res.status(200).json(checks);
  } catch (error) {
    console.error("Get checks error:", error);

    res.status(500).json({
      message: "Failed to fetch check history"
    });
  }
}

module.exports = {
  runMonitorCheck,
  getChecksByMonitor
};