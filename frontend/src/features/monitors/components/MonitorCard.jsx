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

  const displayedStatus = monitor.isPaused
    ? "PAUSED"
    : monitor.status.toUpperCase();

  const statusClass = monitor.isPaused
    ? "status-paused"
    : `status-${monitor.status}`;

  return (
    <article className="monitor-card card">
      <div className="monitor-card-header">
        <div>
          <h2>{monitor.name}</h2>

          <a
            className="monitor-url"
            href={monitor.url}
            target="_blank"
            rel="noreferrer"
          >
            {monitor.url}
          </a>
        </div>

        <span className={`status-badge ${statusClass}`}>
          {displayedStatus}
        </span>
      </div>

      <div className="monitor-meta">
        <div className="monitor-meta-item">
          <span className="monitor-meta-label">
            Check Interval
          </span>

          <span className="monitor-meta-value">
            {monitor.intervalMinutes} min
          </span>
        </div>

        <div className="monitor-meta-item">
          <span className="monitor-meta-label">
            Timeout
          </span>

          <span className="monitor-meta-value">
            {monitor.timeoutMs} ms
          </span>
        </div>

        <div className="monitor-meta-item">
          <span className="monitor-meta-label">
            Last Checked
          </span>

          <span className="monitor-meta-value">
            {monitor.lastCheckedAt
              ? new Date(monitor.lastCheckedAt).toLocaleString()
              : "Never"}
          </span>
        </div>
      </div>

      <div className="monitor-actions">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleCheck}
          disabled={isBusy || monitor.isPaused || editing}
        >
          {checking ? "Checking..." : "Check Now"}
        </button>

        <button
          className="btn btn-secondary"
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
          className="btn btn-secondary"
          type="button"
          onClick={() => setEditing(true)}
          disabled={isBusy || editing}
        >
          Edit
        </button>

        <button
          className="btn btn-danger"
          type="button"
          onClick={handleDelete}
          disabled={isBusy || editing}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>

        <Link
          className="monitor-details-link"
          to={`/monitors/${monitor._id}`}
        >
          View Details →
        </Link>
      </div>

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