const checkService = require("./check.service");

async function runMonitorCheck(req, res) {
  try {
    const result =
      await checkService.runUserMonitorCheck(
        req.user._id,
        req.params.id
      );

    res.status(200).json(result);
  } catch (error) {
    console.error("Monitor check error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to check monitor"
    });
  }
}

async function getChecksByMonitor(req, res) {
  try {
    const checks =
      await checkService.getChecksByMonitor(
        req.user._id,
        req.params.id
      );

    res.status(200).json(checks);
  } catch (error) {
    console.error("Get checks error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to fetch check history"
    });
  }
}

module.exports = {
  runMonitorCheck,
  getChecksByMonitor
};