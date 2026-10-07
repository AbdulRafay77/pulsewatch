import { useParams } from "react-router-dom";
import useMonitorDetails from "../hooks/useMonitorDetails.js";
import MonitorStats from "../components/MonitorStats.jsx"
import ResponseTimeChart
  from "../components/ResponseTimeChart.jsx";

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
    return <p>{error}</p>;
  }

  if (!monitor) {
    return <p>Monitor not found.</p>;
  }

  return (
    <div>
      <h1>{monitor.name}</h1>

      <p>URL: {monitor.url}</p>
      <p>Status: {monitor.status}</p>

      <p>
        Check Interval: {monitor.intervalMinutes} minutes
      </p>

      <p>
        Timeout: {monitor.timeoutMs} ms
      </p>

      <p>
        Last Checked:{" "}
        {monitor.lastCheckedAt
          ? new Date(
              monitor.lastCheckedAt
            ).toLocaleString()
          : "Never"}
      </p>

      <MonitorStats checks={checks} />

      <ResponseTimeChart checks={checks} />

      <h2>Recent Checks</h2>

      {checks.length === 0 ? (
        <p>No checks yet.</p>
      ) : (
        <div>
          {checks.map((check) => (
            <div key={check._id}>
              <p>
                {check.success ? "UP" : "DOWN"}
              </p>

              <p>
                Status Code:{" "}
                {check.statusCode ?? "N/A"}
              </p>

              <p>
                Response Time: {check.responseTime} ms
              </p>

              <p>
                Checked:{" "}
                {new Date(
                  check.checkedAt
                ).toLocaleString()}
              </p>

              {check.errorMessage && (
                <p>
                  Error: {check.errorMessage}
                </p>
              )}

              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MonitorDetailsPage;