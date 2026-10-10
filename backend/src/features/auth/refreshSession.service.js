const RefreshSession =
  require("./refreshSession.model.js");

const {
  createRefreshToken,
  hashRefreshToken
} = require("../../modules/auth/token.service.js");

const User =
  require("../../modules/users/user.model.js");

async function createSession(userId) {
  const refreshToken =
    createRefreshToken();

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

async function rotateSession(refreshToken) {
  const tokenHash =
    hashRefreshToken(refreshToken);

  const session =
    await RefreshSession.findOneAndDelete({
      tokenHash,
      expiresAt: {
        $gt: new Date()
      }
    });

  if (!session) {
    const error = new Error(
      "Invalid or expired refresh token"
    );
    error.statusCode = 401;
    throw error;
  }

  const user =
    await User.findById(session.userId);

  if (!user) {
    const error = new Error(
      "User no longer exists"
    );
    error.statusCode = 401;
    throw error;
  }

  const newRefreshToken =
    await createSession(user._id);

  return {
    user: {
      _id: user._id,
      username: user.username,
      email: user.email
    },
    refreshToken: newRefreshToken
  };
}

async function revokeSession(refreshToken) {
  const tokenHash =
    hashRefreshToken(refreshToken);

  await RefreshSession.deleteOne({
    tokenHash
  });
}

module.exports = {
  createSession,
  rotateSession,
  revokeSession
};