import useMonitors from "../hooks/useMonitors.js";
import MonitorCard from "../components/MonitorCard.jsx";
import CreateMonitorForm from "../components/CreateMonitorForm.jsx";
import "../monitors.css";

function MonitorsPage() {
  const {
    monitors,
    loading,
    error,
    addMonitor,
    checkMonitorNow,
    toggleMonitorPause,
    editMonitor,
    removeMonitor
  } = useMonitors();

  if (loading) {
    return (
      <main className="page">
        <p>Loading monitors...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Monitors</h1>
        <p>
          Monitor your websites and APIs for uptime,
          availability and response time.
        </p>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <div className="monitors-layout">
        <CreateMonitorForm onCreate={addMonitor} />

        <section>
          {monitors.length === 0 ? (
            <div className="empty-state">
              <h2>No monitors yet</h2>
              <p>
                Create your first monitor to start tracking
                uptime and response time.
              </p>
            </div>
          ) : (
            <div className="monitor-list">
              {monitors.map((monitor) => (
                <MonitorCard
                  key={monitor._id}
                  monitor={monitor}
                  onCheck={checkMonitorNow}
                  onTogglePause={toggleMonitorPause}
                  onEdit={editMonitor}
                  onDelete={removeMonitor}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default MonitorsPage;