function MonitorCard({ monitor }) {
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
    </div>
  );
}

export default MonitorCard;