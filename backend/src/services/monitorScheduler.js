const Monitor = require("../modules/monitors/monitor.model");
const checkService = require("../modules/checks/check.service");

let schedulerRunning = false;

function isMonitorDue(monitor) {
  if (!monitor.lastCheckedAt) {
    return true;
  }

  const intervalMs =
    monitor.intervalMinutes * 60 * 1000;

  const nextCheckTime =
    monitor.lastCheckedAt.getTime() + intervalMs;

  return Date.now() >= nextCheckTime;
}

async function runDueChecks() {
  if (schedulerRunning) {
    return;
  }

  schedulerRunning = true;

  try {
    const monitors = await Monitor.find({
      isPaused: false
    });

    const dueMonitors = monitors.filter(isMonitorDue);

    for (const monitor of dueMonitors) {
      try {
        console.log(
          `[${new Date().toLocaleTimeString()}] Checking monitor: ${monitor.name}`
        );

        await checkService.runMonitorCheck(
          monitor._id
        );
      } catch (error) {
        console.error(
          `Automatic check failed for ${monitor.name}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error(
      "Scheduler error:",
      error.message
    );
  } finally {
    schedulerRunning = false;
  }
}

function startMonitorScheduler() {
  console.log("Monitor scheduler started");

  runDueChecks();

  setInterval(() => {
    runDueChecks();
  }, 30 * 1000);
}

module.exports = {
  startMonitorScheduler
};