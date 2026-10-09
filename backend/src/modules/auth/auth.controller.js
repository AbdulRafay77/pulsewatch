const authService = require("./auth.service.js");
const {
  createAccessToken
} = require("./token.service.js");

async function signup(req, res) {
  try {
    const user = await authService.signup(req.body);

    const accessToken = createAccessToken(user);

    res.status(201).json({
      message: "Account created successfully",
      user,
      accessToken
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to create account"
    });
  }
}

async function login(req, res) {
  try {
    const user = await authService.login(req.body);

    const accessToken = createAccessToken(user);

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(error.statusCode || 500).json({
      message: error.statusCode
        ? error.message
        : "Failed to login"
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
  getMe
};