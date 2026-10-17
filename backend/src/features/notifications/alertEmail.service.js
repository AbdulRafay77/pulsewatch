const User =
  require("../../modules/users/user.model.js");

const {
  sendEmail
} = require("./email.service.js");

async function sendIncidentAlertEmail({
  userId,
  monitor,
  incident,
  type,
  message
}) {
  const user = await User.findById(
    userId
  ).select("email username emailAlertsEnabled");

  if (!user) {
    throw new Error(
      "Cannot send alert email: user not found"
    );
  }

  console.log(
    "Email preference:",
    user.emailAlertsEnabled,
    "Type:",
    typeof user.emailAlertsEnabled
  );

  if (user.emailAlertsEnabled === false) {
    return {
      skipped: true,
      reason: "email_alerts_disabled"
    };
  }

  const frontendUrl =
    process.env.FRONTEND_URL ||
    "http://localhost:5173";

  const monitorUrl =
    `${frontendUrl}/monitors/${monitor._id}`;

  const isDown =
    type === "monitor_down";

  const subject = isDown
    ? `🔴 ${monitor.name} is down`
    : `🟢 ${monitor.name} recovered`;

  const statusText = isDown
    ? "DOWN"
    : "RECOVERED";

  const text = `
PulseWatch Alert

Monitor: ${monitor.name}
Status: ${statusText}

${message}

Monitor URL:
${monitor.url}

View monitor:
${monitorUrl}

Incident ID:
${incident._id}
  `.trim();

  const html = `
    <h2>PulseWatch</h2>

    <h3>${monitor.name}</h3>

    <p>
      Status:
      <strong>${statusText}</strong>
    </p>

    <p>${message}</p>

    <p>
      <strong>Endpoint:</strong>
      ${monitor.url}
    </p>

    <p>
      <a href="${monitorUrl}">
        View monitor in PulseWatch
      </a>
    </p>
  `;

  console.log(
    `[EMAIL] ${type} | ${monitor.name} | ${user.email}`
  );

  return sendEmail({
    to: user.email,
    subject,
    text,
    html
  });
}

module.exports = {
  sendIncidentAlertEmail
};