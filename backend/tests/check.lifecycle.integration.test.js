const os = require("os");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.mock("../src/services/checkWithRetries.js", () => jest.fn());

jest.mock(
  "../src/features/notifications/alertEmail.service.js",
  () => ({
    sendIncidentAlertEmail: jest.fn().mockResolvedValue({})
  })
);

const checkWithRetries = require("../src/services/checkWithRetries.js");
const alertEmailService = require(
  "../src/features/notifications/alertEmail.service.js"
);

const checkService = require("../src/modules/checks/check.service.js");
const Monitor = require("../src/modules/monitors/monitor.model.js");
const Check = require("../src/modules/checks/check.model.js");
const Incident = require("../src/modules/incidents/incident.model.js");
const Notification = require(
  "../src/features/notifications/notification.model.js"
);

jest.setTimeout(60000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri(), {
    runtimeAdapters: {
      os
    }
  });
});

afterEach(async () => {
  checkWithRetries.mockReset();
  alertEmailService.sendIncidentAlertEmail.mockClear();

  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});

async function createTestMonitor() {
  return Monitor.create({
    userId: new mongoose.Types.ObjectId(),
    name: "Example Monitor",
    url: "https://example.com/",
    intervalMinutes: 5,
    timeoutMs: 5000
  });
}

describe("Monitor check lifecycle", () => {
  test("creates an incident when a monitor goes down", async () => {
    const monitor = await createTestMonitor();

    checkWithRetries.mockResolvedValue({
      success: false,
      statusCode: 500,
      responseTime: 120,
      errorMessage: null
    });

    const result = await checkService.runMonitorCheck(
      monitor._id
    );

    expect(result.monitor.status).toBe("down");
    expect(result.check.success).toBe(false);

    const checks = await Check.find({
      monitorId: monitor._id
    });

    expect(checks).toHaveLength(1);

    const incidents = await Incident.find({
      monitorId: monitor._id
    });

    expect(incidents).toHaveLength(1);
    expect(incidents[0].status).toBe("active");
    expect(incidents[0].reason).toBe("HTTP 500");

    const notifications = await Notification.find({
      monitorId: monitor._id
    });

    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("monitor_down");

    expect(
      alertEmailService.sendIncidentAlertEmail
    ).toHaveBeenCalledTimes(1);
  });

  test("does not create duplicate incidents while monitor remains down", async () => {
    const monitor = await createTestMonitor();

    checkWithRetries.mockResolvedValue({
      success: false,
      statusCode: 500,
      responseTime: 120,
      errorMessage: null
    });

    await checkService.runMonitorCheck(monitor._id);
    await checkService.runMonitorCheck(monitor._id);

    const checks = await Check.find({
      monitorId: monitor._id
    });

    expect(checks).toHaveLength(2);

    const incidents = await Incident.find({
      monitorId: monitor._id
    });

    expect(incidents).toHaveLength(1);
    expect(incidents[0].status).toBe("active");

    const notifications = await Notification.find({
      monitorId: monitor._id
    });

    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe("monitor_down");

    expect(
      alertEmailService.sendIncidentAlertEmail
    ).toHaveBeenCalledTimes(1);
  });

  test("resolves the incident when the monitor recovers", async () => {
    const monitor = await createTestMonitor();

    checkWithRetries
      .mockResolvedValueOnce({
        success: false,
        statusCode: 500,
        responseTime: 120,
        errorMessage: null
      })
      .mockResolvedValueOnce({
        success: true,
        statusCode: 200,
        responseTime: 80,
        errorMessage: null
      });

    await checkService.runMonitorCheck(monitor._id);

    const recoveryResult =
      await checkService.runMonitorCheck(
        monitor._id
      );

    expect(recoveryResult.monitor.status).toBe("up");
    expect(recoveryResult.check.success).toBe(true);

    const checks = await Check.find({
      monitorId: monitor._id
    });

    expect(checks).toHaveLength(2);

    const incident = await Incident.findOne({
      monitorId: monitor._id
    });

    expect(incident).not.toBeNull();
    expect(incident.status).toBe("resolved");
    expect(incident.resolvedAt).not.toBeNull();
    expect(incident.durationMs).toBeGreaterThanOrEqual(0);

    const notifications = await Notification.find({
      monitorId: monitor._id
    }).sort({ createdAt: 1 });

    expect(notifications).toHaveLength(2);
    expect(notifications[0].type).toBe("monitor_down");
    expect(notifications[1].type).toBe(
      "monitor_recovered"
    );

    expect(
      alertEmailService.sendIncidentAlertEmail
    ).toHaveBeenCalledTimes(2);
  });
});