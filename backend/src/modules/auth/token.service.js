const jwt = require("jsonwebtoken");

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

module.exports = {
  createAccessToken
};