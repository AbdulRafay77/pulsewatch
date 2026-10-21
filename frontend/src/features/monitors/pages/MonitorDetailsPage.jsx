import { useParams } from "react-router-dom";
import useMonitorDetails from "../hooks/useMonitorDetails.js";
import MonitorStats from "../components/MonitorStats.jsx";
import ResponseTimeChart from "../components/ResponseTimeChart.jsx";

function MonitorDetailsPage() {
  const { id } = useParams();

  const {
    monitor,
    checks,
    loading,
    error
  } = useMonitorDetails(id);

  if (loading) {
    return <p>Loading monitor details...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (!monitor) {
    return <p>This monitor could not be found.</p>;
  }

  const displayedStatus = monitor.isPaused
    ? "PAUSED"
    : monitor.status.toUpperCase();

  return (
    <main>
      <header>
        <h1>{monitor.name}</h1>
        <p>Status: <strong>{displayedStatus}</strong></p>

        <p>
          <a href={monitor.url} target="_blank" rel="noreferrer">
            {monitor.url}
          </a>
        </p>
      </header>

      <section>
        <h2>Configuration</h2>

        <p>
          Check Interval: {monitor.intervalMinutes} minutes
        </p>

        <p>Timeout: {monitor.timeoutMs} ms</p>

        <p>
          Last Checked:{" "}
          {monitor.lastCheckedAt
            ? new Date(monitor.lastCheckedAt).toLocaleString()
            : "Never"}
        </p>
      </section>

      <MonitorStats checks={checks} />

      <ResponseTimeChart checks={checks} />

      <section>
        <h2>Recent Checks</h2>

        {checks.length === 0 ? (
          <p>No checks have been recorded yet.</p>
        ) : (
          <table>
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
                    <strong>
                      {check.success ? "UP" : "DOWN"}
                    </strong>
                  </td>

                  <td>{check.statusCode ?? "N/A"}</td>

                  <td>{check.responseTime} ms</td>

                  <td>
                    {new Date(check.checkedAt).toLocaleString()}
                  </td>

                  <td>{check.errorMessage || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default MonitorDetailsPage;