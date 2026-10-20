const os = require("os");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_DAYS = "7";

const app = require("../src/app.js");

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

async function signupUser() {
  const response = await request(app)
    .post("/api/auth/signup")
    .send({
      username: "rafay",
      email: "rafay@example.com",
      password: "password123"
    });

  expect(response.status).toBe(201);

  return response.body.accessToken;
}

describe("User alert preferences API", () => {
  test("email alerts are enabled by default", async () => {
    const accessToken = await signupUser();

    const response = await request(app)
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.emailAlertsEnabled).toBe(true);
  });

  test("user can disable email alerts", async () => {
    const accessToken = await signupUser();

    const updateResponse = await request(app)
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        emailAlertsEnabled: false
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.emailAlertsEnabled).toBe(false);

    const getResponse = await request(app)
      .get("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(getResponse.body.emailAlertsEnabled).toBe(false);
  });

  test("user can enable email alerts again", async () => {
    const accessToken = await signupUser();

    await request(app)
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        emailAlertsEnabled: false
      });

    const response = await request(app)
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        emailAlertsEnabled: true
      });

    expect(response.status).toBe(200);
    expect(response.body.emailAlertsEnabled).toBe(true);
  });

  test("rejects a non-boolean email preference", async () => {
    const accessToken = await signupUser();

    const response = await request(app)
      .patch("/api/users/me/preferences")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        emailAlertsEnabled: "false"
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });
});