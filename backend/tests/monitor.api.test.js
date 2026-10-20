const os = require("os");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

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

async function signupUser({
  username = "rafay",
  email = "rafay@example.com",
  password = "password123"
} = {}) {
  const response = await request(app)
    .post("/api/auth/signup")
    .send({
      username,
      email,
      password
    });

  expect(response.status).toBe(201);
  expect(response.body.accessToken).toBeDefined();

  return response;
}

test("authenticated user can create a monitor", async () => {
  const signupResponse = await signupUser();
  const accessToken = signupResponse.body.accessToken;

  const response = await request(app)
    .post("/api/monitors")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "Example API",
      url: "https://example.com",
      intervalMinutes: 5,
      timeoutMs: 5000
    });

  expect(response.status).toBe(201);
  expect(response.body.name).toBe("Example API");
  expect(response.body.url).toBe("https://example.com/");
  expect(response.body.userId).toBe(
    signupResponse.body.user._id.toString()
  );
});

test("authenticated user cannot create a monitor with an unsafe URL", async () => {
  const signupResponse = await signupUser();
  const accessToken = signupResponse.body.accessToken;

  const response = await request(app)
    .post("/api/monitors")
    .set("Authorization", `Bearer ${accessToken}`)
    .send({
      name: "Unsafe Monitor",
      url: "http://localhost"
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "Local addresses are not allowed"
  );
});

test("user only receives their own monitors", async () => {
  const userA = await signupUser({
    username: "userA",
    email: "usera@example.com"
  });

  const userB = await signupUser({
    username: "userB",
    email: "userb@example.com"
  });

  await request(app)
    .post("/api/monitors")
    .set(
      "Authorization",
      `Bearer ${userA.body.accessToken}`
    )
    .send({
      name: "User A Monitor",
      url: "https://example.com"
    });

  await request(app)
    .post("/api/monitors")
    .set(
      "Authorization",
      `Bearer ${userB.body.accessToken}`
    )
    .send({
      name: "User B Monitor",
      url: "https://example.org"
    });

  const response = await request(app)
    .get("/api/monitors")
    .set(
      "Authorization",
      `Bearer ${userA.body.accessToken}`
    );

  expect(response.status).toBe(200);
  expect(response.body).toHaveLength(1);
  expect(response.body[0].name).toBe(
    "User A Monitor"
  );
});

test("user cannot access another user's monitor", async () => {
  const owner = await signupUser({
    username: "owner",
    email: "owner@example.com"
  });

  const otherUser = await signupUser({
    username: "other",
    email: "other@example.com"
  });

  const createResponse = await request(app)
    .post("/api/monitors")
    .set(
      "Authorization",
      `Bearer ${owner.body.accessToken}`
    )
    .send({
      name: "Owner Monitor",
      url: "https://example.com"
    });

  const monitorId = createResponse.body._id;

  const response = await request(app)
    .get(`/api/monitors/${monitorId}`)
    .set(
      "Authorization",
      `Bearer ${otherUser.body.accessToken}`
    );

  expect(response.status).toBe(404);
  expect(response.body.message).toBe(
    "Monitor not found"
  );
});

describe("Monitor API", () => {
    test("user cannot update another user's monitor", async () => {
    const owner = await signupUser({
      username: "updateOwner",
      email: "updateowner@example.com"
    });

    const otherUser = await signupUser({
      username: "updateOther",
      email: "updateother@example.com"
    });

    const createResponse = await request(app)
      .post("/api/monitors")
      .set("Authorization", `Bearer ${owner.body.accessToken}`)
      .send({
        name: "Original Monitor",
        url: "https://example.com"
      });

    const monitorId = createResponse.body._id;

    const response = await request(app)
      .patch(`/api/monitors/${monitorId}`)
      .set("Authorization", `Bearer ${otherUser.body.accessToken}`)
      .send({
        name: "Hacked Monitor"
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Monitor not found");

    const ownerResponse = await request(app)
      .get(`/api/monitors/${monitorId}`)
      .set("Authorization", `Bearer ${owner.body.accessToken}`);

    expect(ownerResponse.body.name).toBe("Original Monitor");
  });

  test("user cannot delete another user's monitor", async () => {
    const owner = await signupUser({
      username: "deleteOwner",
      email: "deleteowner@example.com"
    });

    const otherUser = await signupUser({
      username: "deleteOther",
      email: "deleteother@example.com"
    });

    const createResponse = await request(app)
      .post("/api/monitors")
      .set("Authorization", `Bearer ${owner.body.accessToken}`)
      .send({
        name: "Protected Monitor",
        url: "https://example.com"
      });

    const monitorId = createResponse.body._id;

    const response = await request(app)
      .delete(`/api/monitors/${monitorId}`)
      .set("Authorization", `Bearer ${otherUser.body.accessToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Monitor not found");

    const ownerResponse = await request(app)
      .get(`/api/monitors/${monitorId}`)
      .set("Authorization", `Bearer ${owner.body.accessToken}`);

    expect(ownerResponse.status).toBe(200);
    expect(ownerResponse.body._id).toBe(monitorId);
  });

  test("health endpoint returns 200", async () => {
    const response = await request(app)
      .get("/api/health");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      status: "ok",
      message: "PulseWatch API is running"
    });
  });

  test("rejects monitor requests without authentication", async () => {
    const response = await request(app)
      .get("/api/monitors");

    expect(response.status).toBe(401);
  });
});