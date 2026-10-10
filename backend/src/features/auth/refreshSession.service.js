const RefreshSession =
  require("./refreshSession.model");

const {
  createRefreshToken,
  hashRefreshToken
} = require("./token.service");

async function createSession(userId) {
  const refreshToken = createRefreshToken();

  const tokenHash =
    hashRefreshToken(refreshToken);

  const expiresInDays =
    Number(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS
    ) || 7;

  const expiresAt = new Date(
    Date.now() +
      expiresInDays *
        24 *
        60 *
        60 *
        1000
  );

  await RefreshSession.create({
    userId,
    tokenHash,
    expiresAt
  });

  return refreshToken;
}

module.exports = {
  createSession
};