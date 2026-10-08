const authService = require("./auth.service.js");

async function signup(req, res) {
  try {
    const user = await authService.signup(
      req.body
    );

    res.status(201).json({
      message: "Account created successfully",
      user
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

module.exports = {
  signup
};