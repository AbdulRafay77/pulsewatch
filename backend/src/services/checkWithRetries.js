const checkMonitor = require("./checkMonitor.js");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkWithRetries(monitor) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  let lastResult = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `[CHECK] ${monitor.name} | attempt ${attempt}/${maxAttempts}`
    );

    const result = await checkMonitor(monitor);

    lastResult = result;

    if (result.success) {
      return result;
    }

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs);
    }
  }

  return lastResult;
}

module.exports = checkWithRetries;