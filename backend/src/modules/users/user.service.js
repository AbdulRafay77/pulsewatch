const User = require("./user.model.js");

async function getPreferences(userId) {
  const user = await User.findById(
    userId
  ).select("emailAlertsEnabled");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    emailAlertsEnabled:
      user.emailAlertsEnabled !== false
  };
}

async function updatePreferences(
  userId,
  data
) {
  const { emailAlertsEnabled } = data;

  if (
    typeof emailAlertsEnabled !== "boolean"
  ) {
    const error = new Error(
      "emailAlertsEnabled must be a boolean"
    );

    error.statusCode = 400;
    throw error;
  }

  const user =
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          emailAlertsEnabled
        }
      },
      {
        returnDocument: "after",
        runValidators: true
      }
    );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    emailAlertsEnabled:
      user.emailAlertsEnabled
  };
}

module.exports = {
  getPreferences,
  updatePreferences
};