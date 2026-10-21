import { useParams } from "react-router-dom";
import useMonitorDetails from "../hooks/useMonitorDetails.js";
import MonitorStats from "../components/MonitorStats.jsx";
import ResponseTimeChart from "../components/ResponseTimeChart.jsx";
import "../monitorDetails.css";

function MonitorDetailsPage() {
  const { id } = useParams();

  const {
    monitor,
    checks,
    loading,
    error
  } = useMonitorDetails(id);

  if (loading) {
    return (
      <main className="monitor-details-page">
        <p>Loading monitor details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="monitor-details-page">
        <p className="error-message" role="alert">
          {error}
        </p>
      </main>
    );
  }

  if (!monitor) {
    return (
      <main className="monitor-details-page">
        <p>This monitor could not be found.</p>
      </main>
    );
  }

  const status = monitor.isPaused
    ? "paused"
    : monitor.status;

  return (
    <main className="monitor-details-page">
      <section className="monitor-details-header">
        <div className="monitor-details-header-top">
          <div>
            <h1>{monitor.name}</h1>

            <a
              className="monitor-details-url"
              href={monitor.url}
              target="_blank"
              rel="noreferrer"
            >
              {monitor.url}
            </a>
          </div>

          <span
            className={`details-status details-status-${status}`}
          >
            {status.toUpperCase()}
          </span>
        </div>

        <div className="monitor-configuration">
          <div className="monitor-config-item">
            <span className="monitor-config-label">
              Check Interval
            </span>

            <span className="monitor-config-value">
              {monitor.intervalMinutes} minutes
            </span>
          </div>

          <div className="monitor-config-item">
            <span className="monitor-config-label">
              Timeout
            </span>

            <span className="monitor-config-value">
              {monitor.timeoutMs} ms
            </span>
          </div>

          <div className="monitor-config-item">
            <span className="monitor-config-label">
              Last Checked
            </span>

            <span className="monitor-config-value">
              {monitor.lastCheckedAt
                ? new Date(
                    monitor.lastCheckedAt
                  ).toLocaleString()
                : "Never"}
            </span>
          </div>
        </div>
      </section>

      <MonitorStats checks={checks} />

      <ResponseTimeChart checks={checks} />

      <section className="check-history-section">
        <h2>Recent Checks</h2>

        {checks.length === 0 ? (
          <div className="check-history-empty">
            No checks have been recorded yet.
          </div>
        ) : (
          <div className="check-table-wrapper">
            <table className="check-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>HTTP Status</th>
                  <th>Response Time</th>
                  <th>Checked At</th>
                  <th>Error</th>
                </tr>
              </thead>

              <tbody>
                {checks.map((check) => (
                  <tr key={check._id}>
                    <td>
                      <span
                        className={
                          check.success
                            ? "check-status check-status-up"
                            : "check-status check-status-down"
                        }
                      >
                        {check.success ? "UP" : "DOWN"}
                      </span>
                    </td>

                    <td>
                      {check.statusCode ?? "N/A"}
                    </td>

                    <td>
                      {check.responseTime} ms
                    </td>

                    <td>
                      {new Date(
                        check.checkedAt
                      ).toLocaleString()}
                    </td>

                    <td className="check-error">
                      {check.errorMessage || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default MonitorDetailsPage;