const os = require("os");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const Monitor = require("../src/modules/monitors/monitor.model.js");
const monitorService = require("../src/modules/monitors/monitor.service.js");

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

describe("Monitor Service", () => {
  test("does not allow another user to read a monitor", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const monitor = await monitorService.createMonitor(ownerId, {
      name: "Private Monitor",
      url: "https://example.com"
    });

    await expect(
      monitorService.getMonitorById(
        otherUserId,
        monitor._id
      )
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Monitor not found"
    });
  });

  test("does not allow another user to update a monitor", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const monitor = await monitorService.createMonitor(ownerId, {
      name: "Original Name",
      url: "https://example.com"
    });

    await expect(
      monitorService.updateMonitor(
        otherUserId,
        monitor._id,
        {
          name: "Hacked Name"
        }
      )
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Monitor not found"
    });

    const unchangedMonitor = await Monitor.findById(
      monitor._id
    );

    expect(unchangedMonitor.name).toBe("Original Name");
  });

  test("does not allow another user to delete a monitor", async () => {
    const ownerId = new mongoose.Types.ObjectId();
    const otherUserId = new mongoose.Types.ObjectId();

    const monitor = await monitorService.createMonitor(ownerId, {
      name: "Protected Monitor",
      url: "https://example.com"
    });

    await expect(
      monitorService.deleteMonitor(
        otherUserId,
        monitor._id
      )
    ).rejects.toMatchObject({
      statusCode: 404,
      message: "Monitor not found"
    });

    const existingMonitor = await Monitor.findById(
      monitor._id
    );

    expect(existingMonitor).not.toBeNull();
  });

  test("creates and saves a monitor for the correct user", async () => {
    const userId = new mongoose.Types.ObjectId();

    const monitor = await monitorService.createMonitor(userId, {
      name: "Example",
      url: "https://example.com"
    });

    expect(monitor._id).toBeDefined();
    expect(monitor.userId.toString()).toBe(userId.toString());
    expect(monitor.url).toBe("https://example.com/");

    const savedMonitor = await Monitor.findById(monitor._id);

    expect(savedMonitor).not.toBeNull();
    expect(savedMonitor.name).toBe("Example");
  });

  test("returns only monitors belonging to the requested user", async () => {
    const userA = new mongoose.Types.ObjectId();
    const userB = new mongoose.Types.ObjectId();

    await monitorService.createMonitor(userA, {
      name: "User A Monitor",
      url: "https://example.com"
    });

    await monitorService.createMonitor(userB, {
      name: "User B Monitor",
      url: "https://example.org"
    });

    const monitors = await monitorService.getMonitors(userA);

    expect(monitors).toHaveLength(1);
    expect(monitors[0].name).toBe("User A Monitor");
    expect(monitors[0].userId.toString()).toBe(userA.toString());
  });

  test("does not update a monitor with an unsafe URL", async () => {
    const userId = new mongoose.Types.ObjectId();

    const monitor = await monitorService.createMonitor(userId, {
      name: "Safe Monitor",
      url: "https://example.com"
    });

    await expect(
      monitorService.updateMonitor(
        userId,
        monitor._id,
        {
          url: "http://localhost"
        }
      )
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Local addresses are not allowed"
    });

    const unchangedMonitor = await Monitor.findById(monitor._id);

    expect(unchangedMonitor.url).toBe("https://example.com/");
  });
});