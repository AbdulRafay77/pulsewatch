import { Link } from "react-router-dom";

function MonitorOverview({ monitors }) {
  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <h2>Monitor Overview</h2>

        <Link
          className="dashboard-panel-link"
          to="/monitors"
        >
          View all monitors →
        </Link>
      </div>

      {monitors.length === 0 ? (
        <div className="dashboard-empty">
          No monitors yet.
        </div>
      ) : (
        monitors.map((monitor) => {
          const status = monitor.isPaused
            ? "paused"
            : monitor.status;

          return (
            <div
              className="monitor-overview-row"
              key={monitor._id}
            >
              <div className="monitor-overview-main">
                <h3>{monitor.name}</h3>

                <span className="monitor-overview-url">
                  {monitor.url}
                </span>
              </div>

              <div className="monitor-overview-side">
                <span
                  className={`dashboard-status dashboard-status-${status}`}
                >
                  {status.toUpperCase()}
                </span>

                <span className="monitor-overview-time">
                  {monitor.lastCheckedAt
                    ? new Date(
                        monitor.lastCheckedAt
                      ).toLocaleString()
                    : "Never checked"}
                </span>

                <Link to={`/monitors/${monitor._id}`}>
                  View →
                </Link>
              </div>
            </div>
          );
        })
      )}
    </section>
  );
}

export default MonitorOverview;