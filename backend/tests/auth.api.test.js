const os = require("os");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
process.env.ACCESS_TOKEN_EXPIRES_IN = "15m";
process.env.REFRESH_TOKEN_EXPIRES_DAYS = "7";

const app = require("../src/app.js");
const User = require("../src/modules/users/user.model.js");
const RefreshSession = require(
  "../src/features/auth/refreshSession.model.js"
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

function getRefreshCookie(response) {
  const cookies = response.headers["set-cookie"];

  expect(cookies).toBeDefined();

  const refreshCookie = cookies.find((cookie) =>
    cookie.startsWith("refreshToken=")
  );

  expect(refreshCookie).toBeDefined();

  return refreshCookie.split(";")[0];
}

describe("Auth API", () => {
  test("signup creates a user with a hashed password and session", async () => {
    const response = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    expect(response.status).toBe(201);
    expect(response.body.accessToken).toBeDefined();

    expect(response.body.user).toMatchObject({
      username: "rafay",
      email: "rafay@example.com"
    });

    expect(response.body.user.passwordHash).toBeUndefined();

    const user = await User.findOne({
      email: "rafay@example.com"
    }).select("+passwordHash");

    expect(user).not.toBeNull();
    expect(user.passwordHash).not.toBe("password123");

    const passwordMatches = await bcrypt.compare(
      "password123",
      user.passwordHash
    );

    expect(passwordMatches).toBe(true);

    const sessions = await RefreshSession.find({
      userId: user._id
    });

    expect(sessions).toHaveLength(1);

    const refreshCookie = getRefreshCookie(response);

    expect(refreshCookie).toContain("refreshToken=");
  });

  test("login succeeds with correct credentials", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "rafay@example.com",
        password: "password123"
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login successful");
    expect(response.body.accessToken).toBeDefined();

    expect(response.body.user.email).toBe(
      "rafay@example.com"
    );

    getRefreshCookie(response);
  });

    test("login rejects an incorrect password", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    const response = await request(app)
      .post("/api/auth/login")
      .send({
        email: "rafay@example.com",
        password: "wrongpassword"
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Invalid email or password"
    );
  });

    test("valid access token can access protected /me route", async () => {
    const signupResponse = await request(app)
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    const response = await request(app)
      .get("/api/auth/me")
      .set(
        "Authorization",
        `Bearer ${signupResponse.body.accessToken}`
      );

    expect(response.status).toBe(200);

    expect(response.body.user).toMatchObject({
      username: "rafay",
      email: "rafay@example.com"
    });
  });

    test("invalid access token is rejected", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set(
        "Authorization",
        "Bearer definitely-not-a-valid-token"
      );

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Invalid or expired access token"
    );
  });

    test("refresh rotates the refresh token and prevents reuse of the old token", async () => {
    const agent = request.agent(app);

    const signupResponse = await agent
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    expect(signupResponse.status).toBe(201);

    const oldRefreshCookie =
      getRefreshCookie(signupResponse);

    const refreshResponse = await agent
      .post("/api/auth/refresh");

    expect(refreshResponse.status).toBe(200);
    expect(
      refreshResponse.body.accessToken
    ).toBeDefined();

    const newRefreshCookie =
      getRefreshCookie(refreshResponse);

    expect(newRefreshCookie).not.toBe(
      oldRefreshCookie
    );

    const sessionsAfterRotation =
      await RefreshSession.find({});

    expect(sessionsAfterRotation).toHaveLength(1);

    const reuseOldTokenResponse = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", oldRefreshCookie);

    expect(reuseOldTokenResponse.status).toBe(401);

    expect(
      reuseOldTokenResponse.body.message
    ).toBe(
      "Invalid or expired refresh token"
    );
  });

    test("logout revokes the refresh session", async () => {
    const agent = request.agent(app);

    await agent
      .post("/api/auth/signup")
      .send({
        username: "rafay",
        email: "rafay@example.com",
        password: "password123"
      });

    let sessions = await RefreshSession.find({});

    expect(sessions).toHaveLength(1);

    const logoutResponse = await agent
      .post("/api/auth/logout");

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe(
      "Logged out successfully"
    );

    sessions = await RefreshSession.find({});

    expect(sessions).toHaveLength(0);

    const refreshResponse = await agent
      .post("/api/auth/refresh");

    expect(refreshResponse.status).toBe(401);
  });
});