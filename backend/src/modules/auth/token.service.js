const jwt = require("jsonwebtoken");
const crypto = require("crypto");

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString()
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:
        process.env.ACCESS_TOKEN_EXPIRES_IN || "15m"
    }
  );
}

function createRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

function hashRefreshToken(token) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  hashRefreshToken
};