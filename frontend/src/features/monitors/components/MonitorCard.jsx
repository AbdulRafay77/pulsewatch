import { useState } from "react";
import { Link } from "react-router-dom";
import EditMonitorForm from "./EditMonitorForm.jsx";

function MonitorCard({
  monitor,
  onCheck,
  onTogglePause,
  onEdit,
  onDelete
}) {
  const [checking, setChecking] = useState(false);
  const [updatingPause, setUpdatingPause] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);

  const isBusy = checking || updatingPause || deleting;

  async function handleCheck() {
    try {
      setChecking(true);
      await onCheck(monitor._id);
    } catch (error) {
      // Visible error is handled by useMonitors.
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
      // Visible error is handled by useMonitors.
    } finally {
      setUpdatingPause(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${monitor.name}"? This will also delete its check and incident history.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      await onDelete(monitor._id);
    } catch (error) {
      // Visible error is handled by useMonitors.
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article>
      <h2>{monitor.name}</h2>

      <p>
        URL:{" "}
        <a href={monitor.url} target="_blank" rel="noreferrer">
          {monitor.url}
        </a>
      </p>

      <p>
        Status:{" "}
        <strong>
          {monitor.isPaused
            ? "PAUSED"
            : monitor.status.toUpperCase()}
        </strong>
      </p>

      <p>Check every: {monitor.intervalMinutes} minutes</p>

      <p>Timeout: {monitor.timeoutMs} ms</p>

      <p>
        Last checked:{" "}
        {monitor.lastCheckedAt
          ? new Date(monitor.lastCheckedAt).toLocaleString()
          : "Never"}
      </p>

      <button
        type="button"
        onClick={handleCheck}
        disabled={isBusy || monitor.isPaused || editing}
      >
        {checking ? "Checking..." : "Check Now"}
      </button>

      <button
        type="button"
        onClick={handleTogglePause}
        disabled={isBusy || editing}
      >
        {updatingPause
          ? "Updating..."
          : monitor.isPaused
            ? "Resume"
            : "Pause"}
      </button>

      <button
        type="button"
        onClick={() => setEditing(true)}
        disabled={isBusy || editing}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={handleDelete}
        disabled={isBusy || editing}
      >
        {deleting ? "Deleting..." : "Delete"}
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
    </article>
  );
}

export default MonitorCard;