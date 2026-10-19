const checkMonitor = require("./checkMonitor.js");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function shouldRetry(result) {
  if (result.errorMessage === "Too many redirects") {
    return false;
  }

  if (result.statusCode === null) {
    return true;
  }

  if (result.statusCode === 408) {
    return true;
  }

  if (result.statusCode === 429) {
    return true;
  }

  if (result.statusCode >= 500 && result.statusCode <= 599) {
    return true;
  }

  return false;
}

async function checkWithRetries(monitor) {
  const maxAttempts = 3;
  const retryDelayMs = 2000;

  let lastResult = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[CHECK] ${monitor.name} | attempt ${attempt}/${maxAttempts}`);

    const result = await checkMonitor(monitor);
    lastResult = result;

    if (result.success) {
      return result;
    }

    if (!shouldRetry(result)) {
      return result;
    }

    if (attempt < maxAttempts) {
      await sleep(retryDelayMs);
    }
  }

  return lastResult;
}

module.exports = checkWithRetries;