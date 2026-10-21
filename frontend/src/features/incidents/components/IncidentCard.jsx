import { Link } from "react-router-dom";

function IncidentCard({ incident }) {
  function formatDuration(durationMs) {
    if (durationMs === null || durationMs === undefined) {
      return "Ongoing";
    }

    const totalSeconds = Math.floor(durationMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }

    if (minutes > 0) {
      return `${minutes} min ${seconds} sec`;
    }

    return `${seconds} sec`;
  }

  const isActive = incident.status === "active";
  const monitor = incident.monitorId;

  return (
    <article className="incident-card">
      <div className="incident-card-header">
        <div>
          <h3>{monitor?.name || "Unknown Monitor"}</h3>

          {monitor?.url && (
            <a
              className="incident-url"
              href={monitor.url}
              target="_blank"
              rel="noreferrer"
            >
              {monitor.url}
            </a>
          )}
        </div>

        <span
          className={
            isActive
              ? "incident-badge incident-badge-active"
              : "incident-badge incident-badge-resolved"
          }
        >
          {isActive ? "ACTIVE" : "RESOLVED"}
        </span>
      </div>

      <div className="incident-reason-box">
        <span className="incident-detail-label">
          Reason
        </span>

        <strong>{incident.reason}</strong>
      </div>

      <div className="incident-details">
        <div>
          <span className="incident-detail-label">
            Started
          </span>

          <span>
            {new Date(
              incident.startedAt
            ).toLocaleString()}
          </span>
        </div>

        <div>
          <span className="incident-detail-label">
            Resolved
          </span>

          <span>
            {incident.resolvedAt
              ? new Date(
                  incident.resolvedAt
                ).toLocaleString()
              : "Not resolved"}
          </span>
        </div>

        <div>
          <span className="incident-detail-label">
            Duration
          </span>

          <span>
            {formatDuration(incident.durationMs)}
          </span>
        </div>
      </div>

      {monitor?._id && (
        <div className="incident-card-footer">
          <Link to={`/monitors/${monitor._id}`}>
            View monitor →
          </Link>
        </div>
      )}
    </article>
  );
}

export default IncidentCard;