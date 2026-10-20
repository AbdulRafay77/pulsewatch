const validateMonitorUrl = require("../src/modules/monitors/monitorUrl.Validator.js");

describe("validateMonitorUrl", () => {
  test("accepts a valid HTTPS URL", () => {
    const result = validateMonitorUrl("https://example.com");

    expect(result).toBe("https://example.com/");
  });

  test("accepts a valid HTTP URL", () => {
    const result = validateMonitorUrl("http://example.com");

    expect(result).toBe("http://example.com/");
  });

  test("rejects an invalid URL", () => {
    expect(() => {
      validateMonitorUrl("not-a-url");
    }).toThrow("Invalid monitor URL");
  });

  test("rejects unsupported protocols", () => {
    expect(() => {
      validateMonitorUrl("ftp://example.com");
    }).toThrow("Only HTTP and HTTPS URLs are allowed");
  });

  test("rejects localhost", () => {
    expect(() => {
      validateMonitorUrl("http://localhost");
    }).toThrow("Local addresses are not allowed");
  });

  test("rejects loopback IP addresses", () => {
    expect(() => {
      validateMonitorUrl("http://127.0.0.1");
    }).toThrow(
      "Private or reserved network addresses are not allowed"
    );
  });

  test("rejects private IP addresses", () => {
    expect(() => {
      validateMonitorUrl("http://192.168.1.1");
    }).toThrow(
      "Private or reserved network addresses are not allowed"
    );
  });

  test("rejects URLs containing credentials", () => {
    expect(() => {
      validateMonitorUrl(
        "https://admin:password@example.com"
      );
    }).toThrow("URLs containing credentials are not allowed");
  });

  test("validation errors have status code 400", () => {
    try {
      validateMonitorUrl("http://localhost");
      throw new Error("Expected validation to fail");
    } catch (error) {
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("Local addresses are not allowed");
    }
  });
});