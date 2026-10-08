import { Link } from "react-router-dom";

function ActiveIncidents({ incidents }) {
  const activeIncidents = incidents.filter(
    (incident) => incident.status === "active"
  );

  if (activeIncidents.length === 0) {
    return (
      <div>
        <h2>Active Incidents</h2>
        <p>No active incidents.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Active Incidents</h2>

      {activeIncidents.map((incident) => (
        <div key={incident._id}>
          <h3>
            {incident.monitorId?.name ||
              "Unknown Monitor"}
          </h3>

          <p>Reason: {incident.reason}</p>

          <p>
            Started:{" "}
            {new Date(
              incident.startedAt
            ).toLocaleString()}
          </p>

          <hr />
        </div>
      ))}

      <Link to="/incidents">
        View All Incidents
      </Link>
    </div>
  );
}

export default ActiveIncidents;