const dns = require("dns").promises;
const net = require("net");

class UnsafeTargetError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsafeTargetError";
  }
}

function isPrivateIPv4(ip) {
  const parts = ip.split(".").map(Number);

  if (parts[0] === 10) return true;

  if (
    parts[0] === 172 &&
    parts[1] >= 16 &&
    parts[1] <= 31
  ) {
    return true;
  }

  if (
    parts[0] === 192 &&
    parts[1] === 168
  ) {
    return true;
  }

  if (parts[0] === 127) return true;

  if (
    parts[0] === 169 &&
    parts[1] === 254
  ) {
    return true;
  }

  return false;
}

async function validateTargetUrl(targetUrl) {
  const parsedUrl = new URL(targetUrl);

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new UnsafeTargetError(
      "Only HTTP and HTTPS URLs are allowed"
    );
  }

  if (
    parsedUrl.hostname === "localhost" ||
    parsedUrl.hostname === "::1"
  ) {
    throw new UnsafeTargetError(
      "Local addresses are not allowed"
    );
  }

  const addresses = await dns.lookup(parsedUrl.hostname, {
    all: true
  });

  for (const address of addresses) {
    if (
      net.isIPv4(address.address) &&
      isPrivateIPv4(address.address)
    ) {
      throw new UnsafeTargetError(
        "Private network addresses are not allowed"
      );
    }

    if (
      net.isIPv6(address.address) &&
      (
        address.address === "::1" ||
        address.address.startsWith("fe80:")
      )
    ) {
      throw new UnsafeTargetError(
        "Private network addresses are not allowed"
      );
    }
  }
}

async function checkMonitor(monitor) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, monitor.timeoutMs);

  const startedAt = Date.now();

  try {
    await validateTargetUrl(monitor.url);

    const response = await fetch(monitor.url, {
      method: "GET",
      signal: controller.signal,
      redirect: "manual"
    });

    const responseTime = Date.now() - startedAt;

    return {
      success: response.ok,
      statusCode: response.status,
      responseTime,
      errorMessage: null
    };
  } catch (error) {
    if (error.name === "UnsafeTargetError") {
      throw error;
    }

    const responseTime = Date.now() - startedAt;

    return {
      success: false,
      statusCode: null,
      responseTime,
      errorMessage:
        error.name === "AbortError"
          ? "Request timed out"
          : error.message
    };
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = checkMonitor;