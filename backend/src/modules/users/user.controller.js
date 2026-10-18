const userService =
  require("./user.service.js");

async function getPreferences(req, res) {
  try {
    const preferences =
      await userService.getPreferences(
        req.user._id
      );

    res.status(200).json(preferences);
  } catch (error) {
    console.error(
      "Get preferences error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to fetch preferences"
      });
  }
}

async function updatePreferences(req, res) {
  try {
    const preferences =
      await userService.updatePreferences(
        req.user._id,
        req.body
      );

    res.status(200).json({
      message:
        "Preferences updated successfully",
      ...preferences
    });
  } catch (error) {
    console.error(
      "Update preferences error:",
      error
    );

    res
      .status(error.statusCode || 500)
      .json({
        message: error.statusCode
          ? error.message
          : "Failed to update preferences"
      });
  }
}

module.exports = {
  getPreferences,
  updatePreferences
};