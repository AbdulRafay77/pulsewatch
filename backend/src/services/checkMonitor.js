const dns = require("dns").promises;
const ipaddr = require("ipaddr.js");
const { Agent, fetch } = require("undici");

const MAX_REDIRECTS = 5;

const REDIRECT_STATUS_CODES = new Set([
  301,
  302,
  303,
  307,
  308
]);

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

class UnsafeTargetError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnsafeTargetError";
    this.statusCode = 400;
  }
}

function isUnsafeIp(ip) {
  if (!ipaddr.isValid(ip)) {
    return true;
  }

  let address = ipaddr.parse(ip);

  if (address.kind() === "ipv6" && address.isIPv4MappedAddress()) {
    address = address.toIPv4Address();
  }

  return address.range() !== "unicast";
}

async function validateTargetUrl(targetUrl) {
  let parsedUrl;

  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw new UnsafeTargetError("Invalid URL");
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw new UnsafeTargetError(
      "Only HTTP and HTTPS URLs are allowed"
    );
  }

  let hostname = parsedUrl.hostname
    .toLowerCase()
    .replace(/\.$/, "");

  if (hostname.startsWith("[") && hostname.endsWith("]")) {
    hostname = hostname.slice(1, -1);
  }

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost")
  ) {
    throw new UnsafeTargetError(
      "Local addresses are not allowed"
    );
  }

  const addresses = await dns.lookup(hostname, {
    all: true
  });

  if (addresses.length === 0) {
    throw new Error("Hostname could not be resolved");
  }

  for (const address of addresses) {
    if (isUnsafeIp(address.address)) {
      throw new UnsafeTargetError(
        "Private or reserved network addresses are not allowed"
      );
    }
  }

  const selectedAddress = addresses[0];

  return {
    address: selectedAddress.address,
    family: selectedAddress.family
  };
}

function createPinnedDispatcher(address, family) {
  return new Agent({
    connect: {
      lookup(hostname, options, callback) {
        if (options?.all) {
          callback(null, [{ address, family }]);
          return;
        }

        callback(null, address, family);
      }
    }
  });
}

async function fetchWithSafeRedirects(targetUrl, signal) {
  let currentUrl = targetUrl;

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
    const validatedTarget = await validateTargetUrl(currentUrl);

    const dispatcher = createPinnedDispatcher(
      validatedTarget.address,
      validatedTarget.family
    );

    try {
      const response = await fetch(currentUrl, {
        method: "GET",
        signal,
        redirect: "manual",
        dispatcher
      });

      const isRedirect = REDIRECT_STATUS_CODES.has(response.status);

      if (!isRedirect) {
        if (response.body) {
          await response.body.cancel();
        }

        return {
          success: response.ok,
          statusCode: response.status
        };
      }

      const location = response.headers.get("location");

      if (response.body) {
        await response.body.cancel();
      }

      if (!location) {
        return {
          success: false,
          statusCode: response.status
        };
      }

      if (redirectCount === MAX_REDIRECTS) {
        throw new Error("Too many redirects");
      }

      currentUrl = new URL(location, currentUrl).toString();
    } finally {
      await dispatcher.close();
    }
  }

  throw new Error("Too many redirects");
}

async function checkMonitor(monitor) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, monitor.timeoutMs);

  const startedAt = Date.now();

  try {
    const result = await fetchWithSafeRedirects(
      monitor.url,
      controller.signal
    );

    const responseTime = Date.now() - startedAt;

    return {
      success: result.success,
      statusCode: result.statusCode,
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