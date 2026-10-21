import { usePreferences } from "../hooks/usePreferences.js";
import "../settings.css";

function SettingsPage() {
  const {
    emailAlertsEnabled,
    loading,
    saving,
    error,
    toggleEmailAlerts
  } = usePreferences();

  if (loading) {
    return (
      <main className="settings-page">
        <p>Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="settings-page">
      <header className="settings-header">
        <h1>Settings</h1>

        <p>
          Manage how PulseWatch communicates with you.
        </p>
      </header>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <section className="settings-section">
        <div className="settings-section-heading">
          <h2>Notifications</h2>

          <p>
            Choose how you want to receive monitoring alerts.
          </p>
        </div>

        <div className="settings-card">
          <div className="settings-option">
            <div className="settings-option-content">
              <div className="settings-option-heading">
                <h3>Email incident alerts</h3>

                <span
                  className={
                    emailAlertsEnabled
                      ? "settings-status settings-status-enabled"
                      : "settings-status settings-status-disabled"
                  }
                >
                  {emailAlertsEnabled
                    ? "Enabled"
                    : "Disabled"}
                </span>
              </div>

              <p>
                Receive an email when a monitor goes down
                or recovers.
              </p>
            </div>

            <button
              className={
                emailAlertsEnabled
                  ? "settings-toggle settings-toggle-on"
                  : "settings-toggle"
              }
              type="button"
              role="switch"
              aria-checked={emailAlertsEnabled}
              aria-label="Email incident alerts"
              disabled={saving}
              onClick={toggleEmailAlerts}
            >
              <span className="settings-toggle-thumb" />
            </button>
          </div>

          {saving && (
            <p className="settings-saving">
              Saving preference...
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default SettingsPage;