import { useState } from "react";
import { Link } from "react-router-dom";
import EditMonitorForm from "./EditMonitorForm.jsx";

function MonitorCard({ monitor, onCheck, onTogglePause, onEdit }) {
  const [checking, setChecking] = useState(false);
  const [updatingPause, setUpdatingPause] = useState(false);
  const [editing, setEditing] = useState(false);

  async function handleCheck() {
    try {
      setChecking(true);

      await onCheck(monitor._id);
    } catch (error) {
      // useMonitors already handles the visible error
    } finally {
      setChecking(false);
    }
  }

  async function handleTogglePause() {
    try {
      setUpdatingPause(true);

      await onTogglePause(
        monitor._id,
        monitor.isPaused
      );
    } catch (error) {
      // visible error handled by useMonitors
    } finally {
      setUpdatingPause(false);
    }
  }

  return (
    <div>
      <h2>{monitor.name}</h2>

      <p>{monitor.url}</p>

      <p>Status: {monitor.status}</p>

      <p>
        Check every: {monitor.intervalMinutes} minutes
      </p>

      <p>
        Timeout: {monitor.timeoutMs} ms
      </p>

      <p>
        {monitor.isPaused ? "Paused" : "Active"}
      </p>

      <p>
        Last checked:{" "}
        {monitor.lastCheckedAt
          ? new Date(monitor.lastCheckedAt).toLocaleString()
          : "Never"}
      </p>

      <button
        onClick={handleCheck}
        disabled={checking || monitor.isPaused}
      >
        {checking ? "Checking..." : "Check Now"}
      </button>

      <button 
        onClick={handleTogglePause}
        disabled={updatingPause}
      >
        {updatingPause
          ? "Updating..."
          : monitor.isPaused
            ? "Resume"
            : "Pause"}
      </button>

      <button onClick={() => setEditing(true)}>
        Edit
      </button>

      <Link to={`/monitors/${monitor._id}`}>
        View Details
      </Link>

      {editing && (
        <EditMonitorForm
          monitor={monitor}
          onSave={async (monitorId, updates) => {
            await onEdit(monitorId, updates);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}

export default MonitorCard;