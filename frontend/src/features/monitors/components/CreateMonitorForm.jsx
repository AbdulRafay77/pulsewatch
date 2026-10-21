import { useState } from "react";

function CreateMonitorForm({ onCreate }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSubmitting(true);

      await onCreate({
        name: name.trim(),
        url: url.trim(),
        intervalMinutes: Number(intervalMinutes),
        timeoutMs: Number(timeoutMs)
      });

      setName("");
      setUrl("");
      setIntervalMinutes(5);
      setTimeoutMs(5000);
    } catch (error) {
      // Visible error is handled by useMonitors.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="monitor-form card" onSubmit={handleSubmit}>
      <h2>Create Monitor</h2>

      <div className="form-group">
        <label htmlFor="name">Monitor Name</label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Payment API"
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">URL</label>

        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/health"
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="interval">
          Check Interval (minutes)
        </label>

        <input
          id="interval"
          type="number"
          min="1"
          value={intervalMinutes}
          onChange={(event) =>
            setIntervalMinutes(event.target.value)
          }
          disabled={submitting}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="timeout">
          Timeout (milliseconds)
        </label>

        <input
          id="timeout"
          type="number"
          min="1000"
          value={timeoutMs}
          onChange={(event) =>
            setTimeoutMs(event.target.value)
          }
          disabled={submitting}
          required
        />
      </div>

      <button 
        className="btn btn-primary btn-full"
        type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Monitor"}
      </button>
    </form>
  );
}

export default CreateMonitorForm;