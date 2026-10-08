import useMonitors from "../hooks/useMonitors.js";
import MonitorCard from "../components/MonitorCard.jsx";
import CreateMonitorForm from "../components/CreateMonitorForm.jsx";

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
    return <p>Loading monitors...</p>;
  }

  return (
    <div>
      <h1>Monitors</h1>

      <CreateMonitorForm onCreate={addMonitor} />

      {error && <p>{error}</p>}

      {monitors.length === 0 ? (
        <p>No monitors yet.</p>
      ) : (
        <div>
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
    </div>
  );
}

export default MonitorsPage;