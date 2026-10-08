import { useState } from "react";

function EditMonitorForm({ monitor, onSave, onCancel }) {
  const [name, setName] = useState(monitor.name);
  const [url, setUrl] = useState(monitor.url);
  const [intervalMinutes, setIntervalMinutes] =
    useState(monitor.intervalMinutes);
  const [timeoutMs, setTimeoutMs] =
    useState(monitor.timeoutMs);

  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      await onSave(monitor._id, {
        name,
        url,
        intervalMinutes: Number(intervalMinutes),
        timeoutMs: Number(timeoutMs)
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit Monitor</h3>

      <div>
        <label>Name</label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
        />
      </div>

      <div>
        <label>URL</label>

        <input
          type="url"
          value={url}
          onChange={(event) =>
            setUrl(event.target.value)
          }
          required
        />
      </div>

      <div>
        <label>Interval (minutes)</label>

        <input
          type="number"
          min="1"
          value={intervalMinutes}
          onChange={(event) =>
            setIntervalMinutes(event.target.value)
          }
          required
        />
      </div>

      <div>
        <label>Timeout (ms)</label>

        <input
          type="number"
          min="1000"
          value={timeoutMs}
          onChange={(event) =>
            setTimeoutMs(event.target.value)
          }
          required
        />
      </div>

      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
    </form>
  );
}

export default EditMonitorForm;