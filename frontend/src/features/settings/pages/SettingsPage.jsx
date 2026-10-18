import { usePreferences } from "../hooks/usePreferences.js";

function SettingsPage() {
  const { emailAlertsEnabled, loading, saving, error, toggleEmailAlerts } = usePreferences();

  if (loading) {
    return <p>Loading settings...</p>;
  }

  return (
    <div>
      <h1>Settings</h1>

      <section>
        <h2>Notifications</h2>

        <div>
          <div>
            <strong>Email alerts</strong>
            <p>Receive an email when a monitor goes down or recovers.</p>
          </div>

          <button type="button" onClick={toggleEmailAlerts} disabled={saving}>
            {saving ? "Saving..." : emailAlertsEnabled ? "Enabled" : "Disabled"}
          </button>
        </div>

        {error && <p>{error}</p>}
      </section>
    </div>
  );
}

export default SettingsPage;
