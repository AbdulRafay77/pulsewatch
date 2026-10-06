import useIncidents from "../hooks/useIncidents.js";
import IncidentCard from "../components/IncidentCard.jsx";

function IncidentsPage() {
  const {
    incidents,
    loading,
    error
  } = useIncidents();

  if (loading) {
    return <p>Loading incidents...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "active"
  );

  const resolvedIncidents = incidents.filter(
    (incident) => incident.status === "resolved"
  );

  return (
    <div>
      <h1>Incidents</h1>

      <section>
        <h2>Active Incidents</h2>

        {activeIncidents.length === 0 ? (
          <p>No active incidents.</p>
        ) : (
          activeIncidents.map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
            />
          ))
        )}
      </section>

      <section>
        <h2>Resolved Incidents</h2>

        {resolvedIncidents.length === 0 ? (
          <p>No resolved incidents.</p>
        ) : (
          resolvedIncidents.map((incident) => (
            <IncidentCard
              key={incident._id}
              incident={incident}
            />
          ))
        )}
      </section>
    </div>
  );
}

export default IncidentsPage;