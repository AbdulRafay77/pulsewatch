import { Link } from "react-router-dom";

function ActiveIncidents({ incidents }) {
  const activeIncidents = incidents
    .filter((incident) => incident.status === "active")
    .slice(0, 3);

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h2>Active Incidents</h2>

        <Link
          className="dashboard-panel-link"
          to="/incidents"
        >
          View all incidents →
        </Link>
      </div>

      {activeIncidents.length === 0 ? (
        <div className="dashboard-empty">
          No active incidents. Everything looks healthy.
        </div>
      ) : (
        activeIncidents.map((incident) => (
          <div className="incident-row" key={incident._id}>
            <h3>
              {incident.monitorId?.name || "Unknown Monitor"}
            </h3>

            <p className="incident-reason">
              {incident.reason}
            </p>

            <span className="incident-meta">
              Started{" "}
              {new Date(incident.startedAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </section>
  );
}

export default ActiveIncidents;