const ipaddr = require("ipaddr.js");

function createValidationError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function validateMonitorUrl(url) {
  if (typeof url !== "string" || !url.trim()) {
    throw createValidationError("Monitor URL is required");
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(url.trim());
  } catch {
    throw createValidationError("Invalid monitor URL");
  }

  if (
    parsedUrl.protocol !== "http:" &&
    parsedUrl.protocol !== "https:"
  ) {
    throw createValidationError(
      "Only HTTP and HTTPS URLs are allowed"
    );
  }

  if (parsedUrl.username || parsedUrl.password) {
    throw createValidationError(
      "URLs containing credentials are not allowed"
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
    throw createValidationError(
      "Local addresses are not allowed"
    );
  }

  if (ipaddr.isValid(hostname)) {
    let address = ipaddr.parse(hostname);

    if (
      address.kind() === "ipv6" &&
      address.isIPv4MappedAddress()
    ) {
      address = address.toIPv4Address();
    }

    if (address.range() !== "unicast") {
      throw createValidationError(
        "Private or reserved network addresses are not allowed"
      );
    }
  }

  return parsedUrl.toString();
}

module.exports = validateMonitorUrl;