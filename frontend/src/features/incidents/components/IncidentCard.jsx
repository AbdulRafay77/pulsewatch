function IncidentCard({ incident }) {
  function formatDuration(durationMs) {
    if (durationMs === null) {
      return "Ongoing";
    }

    const totalSeconds = Math.floor(durationMs / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) {
      return `${seconds} seconds`;
    }

    return `${minutes} min ${seconds} sec`;
  }

  return (
    <div>
      <h2>{incident.monitorId?.name || "Unknown Monitor"}</h2>

      <p>
        URL: {incident.monitorId?.url || "Unknown"}
      </p>

      <p>
        Incident Status: {incident.status}
      </p>

      <p>
        Monitor Status: {incident.monitorId?.status}
      </p>

      <p>
        Reason: {incident.reason}
      </p>

      <p>
        Started:{" "}
        {new Date(incident.startedAt).toLocaleString()}
      </p>

      <p>
        Resolved:{" "}
        {incident.resolvedAt
          ? new Date(incident.resolvedAt).toLocaleString()
          : "Not resolved"}
      </p>

      <p>
        Duration: {formatDuration(incident.durationMs)}
      </p>
    </div>
  );
}

export default IncidentCard;