import useIncidents from "../hooks/useIncidents.js";
import IncidentCard from "../components/IncidentCard.jsx";
import "../incidents.css";

function IncidentsPage() {
  const {
    incidents,
    loading,
    error
  } = useIncidents();

  if (loading) {
    return (
      <main className="incidents-page">
        <p>Loading incidents...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="incidents-page">
        <p className="error-message" role="alert">
          {error}
        </p>
      </main>
    );
  }

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "active"
  );

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "resolved"
  );

  return (
    <main className="incidents-page">
      <header className="incidents-header">
        <h1>Incidents</h1>

        <p>
          Track active outages and review previously resolved incidents.
        </p>
      </header>

      <section className="incident-section">
        <div className="incident-section-heading">
          <div>
            <h2>Active Incidents</h2>
            <p>Issues that currently require attention.</p>
          </div>

          <span className="incident-section-count incident-section-count-active">
            {activeIncidents.length}
          </span>
        </div>

        {activeIncidents.length === 0 ? (
          <div className="incident-empty incident-empty-healthy">
            <strong>No active incidents</strong>
            <p>All monitored services are currently clear.</p>
          </div>
        ) : (
          <div className="incident-list">
            {activeIncidents.map((incident) => (
              <IncidentCard
                key={incident._id}
                incident={incident}
              />
            ))}
          </div>
        )}
      </section>

      <section className="incident-section">
        <div className="incident-section-heading">
          <div>
            <h2>Resolved Incidents</h2>
            <p>Historical incidents that have recovered.</p>
          </div>

          <span className="incident-section-count">
            {resolvedIncidents.length}
          </span>
        </div>

        {resolvedIncidents.length === 0 ? (
          <div className="incident-empty">
            <strong>No resolved incidents yet</strong>
            <p>Resolved outages will appear here.</p>
          </div>
        ) : (
          <div className="incident-list">
            {resolvedIncidents.map((incident) => (
              <IncidentCard
                key={incident._id}
                incident={incident}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default IncidentsPage;