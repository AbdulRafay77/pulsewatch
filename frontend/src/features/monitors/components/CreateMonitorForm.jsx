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
        name,
        url,
        intervalMinutes: Number(intervalMinutes),
        timeoutMs: Number(timeoutMs)
      });

      setName("");
      setUrl("");
      setIntervalMinutes(5);
      setTimeoutMs(5000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Monitor</h2>

      <div>
        <label htmlFor="name">Monitor Name</label>

        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Payment API"
          required
        />
      </div>

      <div>
        <label htmlFor="url">URL</label>

        <input
          id="url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://example.com/health"
          required
        />
      </div>

      <div>
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
          required
        />
      </div>

      <div>
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
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "Creating..." : "Create Monitor"}
      </button>
    </form>
  );
}

export default CreateMonitorForm;