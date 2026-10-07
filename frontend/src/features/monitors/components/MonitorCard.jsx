import { useState } from "react";
import { Link } from "react-router-dom";

function MonitorCard({ monitor, onCheck }) {
  const [checking, setChecking] = useState(false);

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

      <Link to={`/monitors/${monitor._id}`}>
        View Details
      </Link>
    </div>
  );
}

export default MonitorCard;