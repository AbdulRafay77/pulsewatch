import { useState } from "react";

function EditMonitorForm({ monitor, onSave, onCancel }) {
  const [name, setName] = useState(monitor.name);
  const [url, setUrl] = useState(monitor.url);
  const [intervalMinutes, setIntervalMinutes] = useState(
    monitor.intervalMinutes
  );
  const [timeoutMs, setTimeoutMs] = useState(monitor.timeoutMs);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      await onSave(monitor._id, {
        name: name.trim(),
        url: url.trim(),
        intervalMinutes: Number(intervalMinutes),
        timeoutMs: Number(timeoutMs)
      });
    } catch (error) {
      // Visible error is handled by useMonitors.
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="edit-monitor-form" onSubmit={handleSubmit}>
      <h3>Edit Monitor</h3>

      <div className="form-group">
        <label htmlFor={`name-${monitor._id}`}>Name</label>

        <input
          id={`name-${monitor._id}`}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          disabled={saving}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`url-${monitor._id}`}>URL</label>

        <input
          id={`url-${monitor._id}`}
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          disabled={saving}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`interval-${monitor._id}`}>
          Interval (minutes)
        </label>

        <input
          id={`interval-${monitor._id}`}
          type="number"
          min="1"
          value={intervalMinutes}
          onChange={(event) => setIntervalMinutes(event.target.value)}
          disabled={saving}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor={`timeout-${monitor._id}`}>
          Timeout (ms)
        </label>

        <input
          id={`timeout-${monitor._id}`}
          type="number"
          min="1000"
          value={timeoutMs}
          onChange={(event) => setTimeoutMs(event.target.value)}
          disabled={saving}
          required
        />
      </div>

      <div className="edit-form-actions">
        <button
          className="btn btn-primary"
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          className="btn btn-secondary"
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default EditMonitorForm;