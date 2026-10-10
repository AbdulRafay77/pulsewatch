const authService = require("./auth.service.js");

const {
  createAccessToken
} = require("./token.service.js");

const refreshSessionService =
  require("../../features/auth/refreshSession.service.js");

function setRefreshCookie(res, refreshToken) {
  const days =
    Number(
      process.env.REFRESH_TOKEN_EXPIRES_DAYS
    ) || 7;

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/api/auth",

      maxAge:
        days *
        24 *
        60 *
        60 *
        1000
    }
  );
}

function clearRefreshCookie(res) {
  res.clearCookie(
    "refreshToken",
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/api/auth"
    }
  );
}

async function signup(req, res) {
  try {
    const user =
      await authService.signup(req.body);

    const accessToken =
      createAccessToken(user);

    const refreshToken =
      await refreshSessionService.createSession(
        user._id
      );

    setRefreshCookie(
      res,
      refreshToken
    );

    res.status(201).json({
      message:
        "Account created successfully",
      user,
      accessToken
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to create account"
      });
  }
}

async function login(req, res) {
  try {
    const user =
      await authService.login(req.body);

    const accessToken =
      createAccessToken(user);

    const refreshToken =
      await refreshSessionService.createSession(
        user._id
      );

    setRefreshCookie(
      res,
      refreshToken
    );

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to login"
      });
  }
}

async function refresh(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    const {
      user,
      refreshToken: newRefreshToken
    } =
      await refreshSessionService.rotateSession(
        refreshToken
      );

    const accessToken =
      createAccessToken(user);

    setRefreshCookie(
      res,
      newRefreshToken
    );

    res.status(200).json({
      user,
      accessToken
    });
  } catch (error) {
    console.error(
      "Refresh error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to refresh session"
      });
  }
}

async function logout(req, res) {
  try {
    const refreshToken =
      req.cookies.refreshToken;

    if (refreshToken) {
      await refreshSessionService.revokeSession(
        refreshToken
      );
    }

    clearRefreshCookie(res);

    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    res.status(500).json({
      message: "Failed to logout"
    });
  }
}

async function getMe(req, res) {
  res.status(200).json({
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
}

module.exports = {
  signup,
  login,
  refresh,
  getMe
};