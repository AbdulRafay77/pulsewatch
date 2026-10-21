import useDashboard from "../hooks/useDashboard.js";
import StatCard from "../components/StatCard.jsx";
import MonitorOverview from "../components/MonitorOverview.jsx";
import ActiveIncidents from "../components/ActiveIncidents.jsx";
import "../dashboard.css";

function Dashboard() {
  const {
    monitors,
    incidents,
    loading,
    error
  } = useDashboard();

  if (loading) {
    return (
      <main className="dashboard-page">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <p className="error-message" role="alert">
          {error}
        </p>
      </main>
    );
  }

  const totalMonitors = monitors.length;

  const upMonitors = monitors.filter(
    (monitor) =>
      monitor.status === "up" && !monitor.isPaused
  ).length;

  const downMonitors = monitors.filter(
    (monitor) =>
      monitor.status === "down" && !monitor.isPaused
  ).length;

  const pausedMonitors = monitors.filter(
    (monitor) => monitor.isPaused
  ).length;

  const unknownMonitors = monitors.filter(
    (monitor) =>
      monitor.status === "unknown" && !monitor.isPaused
  ).length;

  const activeIncidents = incidents.filter(
    (incident) => incident.status === "active"
  ).length;

  const activeMonitors = monitors.filter(
    (monitor) => !monitor.isPaused
  );

  const checkedActiveMonitors = activeMonitors.filter(
    (monitor) => monitor.status !== "unknown"
  );

  const healthyActiveMonitors = checkedActiveMonitors.filter(
    (monitor) => monitor.status === "up"
  ).length;

  const healthPercentage =
    checkedActiveMonitors.length === 0
      ? 0
      : (
          healthyActiveMonitors /
          checkedActiveMonitors.length *
          100
        ).toFixed(1);

  let healthText = "Waiting for monitor data";
  let healthTone = "warning";

  if (checkedActiveMonitors.length > 0 && downMonitors === 0) {
    healthText = "All monitored services are healthy";
    healthTone = "healthy";
  }

  if (downMonitors > 0) {
    healthText = `${downMonitors} ${
      downMonitors === 1 ? "service needs" : "services need"
    } attention`;

    healthTone = "danger";
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard</h1>

        <p>
          Current health and activity across your monitored services.
        </p>
      </header>

      <section className="health-summary">
        <div className="health-summary-main">
          <span
            className={`health-indicator health-indicator-${healthTone}`}
          />

          <div>
            <h2>{healthText}</h2>

            <p>
              {activeMonitors.length} active ·{" "}
              {pausedMonitors} paused ·{" "}
              {unknownMonitors} unknown
            </p>
          </div>
        </div>

        <div className="health-percentage">
          {checkedActiveMonitors.length === 0
            ? "N/A"
            : `${healthPercentage}%`}
        </div>
      </section>

      <section className="dashboard-stats">
        <StatCard
          title="Total Monitors"
          value={totalMonitors}
        />

        <StatCard
          title="Up"
          value={upMonitors}
          tone="up"
        />

        <StatCard
          title="Down"
          value={downMonitors}
          tone="down"
        />

        <StatCard
          title="Active Incidents"
          value={activeIncidents}
          tone="incidents"
        />
      </section>

      <div className="dashboard-content">
        <MonitorOverview monitors={monitors.slice(0, 5)} />
        <ActiveIncidents incidents={incidents} />
      </div>
    </main>
  );
}

export default Dashboard;