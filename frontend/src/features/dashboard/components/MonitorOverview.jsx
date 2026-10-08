import { Link } from "react-router-dom";

function MonitorOverview({ monitors }) {
  if (monitors.length === 0) {
    return <p>No monitors yet.</p>;
  }

  return (
    <div>
      <h2>Monitor Overview</h2>

      {monitors.map((monitor) => (
        <div key={monitor._id}>
          <h3>{monitor.name}</h3>

          <p>
            Status:{" "}
            {monitor.isPaused
              ? "Paused"
              : monitor.status}
          </p>

          <p>{monitor.url}</p>

          <p>
            Last checked:{" "}
            {monitor.lastCheckedAt
              ? new Date(
                  monitor.lastCheckedAt
                ).toLocaleString()
              : "Never"}
          </p>

          <Link to={`/monitors/${monitor._id}`}>
            View Details
          </Link>

          <Link to="/monitors">
            View All Monitors
          </Link>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default MonitorOverview;