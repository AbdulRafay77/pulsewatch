const dns = require("dns").promises;
const ipaddr = require("ipaddr.js");
const { Agent, fetch } = require("undici");

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

async function checkMonitor(monitor) {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, monitor.timeoutMs);

  const startedAt = Date.now();

  try {
    const validatedTarget = await validateTargetUrl(monitor.url);

    const dispatcher = createPinnedDispatcher(
      validatedTarget.address,
      validatedTarget.family
    );

    try {
      const response = await fetch(monitor.url, {
        method: "GET",
        signal: controller.signal,
        redirect: "manual",
        dispatcher
      });

      const responseTime = Date.now() - startedAt;

      if (response.body) {
        await response.body.cancel();
      }

      return {
        success: response.ok,
        statusCode: response.status,
        responseTime,
        errorMessage: null
      };
    } finally {
      await dispatcher.close();
    }
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