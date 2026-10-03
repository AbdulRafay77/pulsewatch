import useMonitors from "../hooks/useMonitors.js";

function MonitorsPage() {
  const { monitors, loading, error } = useMonitors();

  if (loading) {
    return <p>Loading monitors...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Monitors</h1>

      {monitors.map((monitor) => (
        <div key={monitor._id}>
          <h2>{monitor.name}</h2>
          <p>{monitor.url}</p>
          <p>Status: {monitor.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MonitorsPage;