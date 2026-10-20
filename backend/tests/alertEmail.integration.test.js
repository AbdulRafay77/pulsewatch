const os = require("os");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

jest.mock(
  "../src/features/notifications/email.service.js",
  () => ({
    sendEmail: jest.fn().mockResolvedValue({
      messageId: "test-message"
    })
  })
);

const { sendEmail } = require(
  "../src/features/notifications/email.service.js"
);

const alertEmailService = require(
  "../src/features/notifications/alertEmail.service.js"
);

const User = require("../src/modules/users/user.model.js");

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
  sendEmail.mockClear();

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

async function createTestUser(emailAlertsEnabled) {
  return User.create({
    username: "rafay",
    email: "rafay@example.com",
    passwordHash: "test-password-hash",
    emailAlertsEnabled
  });
}

function createFakeAlertData(userId) {
  return {
    userId,
    monitor: {
      _id: new mongoose.Types.ObjectId(),
      name: "Example Monitor"
    },
    incident: {
      _id: new mongoose.Types.ObjectId()
    },
    type: "monitor_down",
    message: "Example Monitor returned HTTP 500."
  };
}

describe("Alert email preferences", () => {
  test("does not send email when email alerts are disabled", async () => {
    const user = await createTestUser(false);

    const result =
      await alertEmailService.sendIncidentAlertEmail(
        createFakeAlertData(user._id)
      );

    expect(result).toEqual({
      skipped: true,
      reason: "email_alerts_disabled"
    });

    expect(sendEmail).not.toHaveBeenCalled();
  });

  test("sends email when email alerts are enabled", async () => {
    const user = await createTestUser(true);

    await alertEmailService.sendIncidentAlertEmail(
      createFakeAlertData(user._id)
    );

    expect(sendEmail).toHaveBeenCalledTimes(1);

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "rafay@example.com"
      })
    );
  });
});