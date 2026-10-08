import useDashboard from "../hooks/useDashboard.js";
import StatCard from "../components/StatCard.jsx";
import MonitorOverview from "../components/MonitorOverview.jsx";
import ActiveIncidents from "../components/ActiveIncidents.jsx";

function Dashboard() {
  const {
    monitors,
    incidents,
    loading,
    error
  } = useDashboard();

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
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

  const healthyActiveMonitors =
    checkedActiveMonitors.filter(
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

  return (
    <div>
      <h1>PulseWatch Dashboard</h1>

      <p>
        Current overview of your monitored services.
      </p>

      <div>
        <StatCard
          title="Total Monitors"
          value={totalMonitors}
        />

        <StatCard
          title="Up"
          value={upMonitors}
        />

        <StatCard
          title="Down"
          value={downMonitors}
        />

        <StatCard
          title="Paused"
          value={pausedMonitors}
        />

        <StatCard
          title="Unknown"
          value={unknownMonitors}
        />

        <StatCard
          title="Active Incidents"
          value={activeIncidents}
        />

        <StatCard
          title="Current Health"
          value={`${healthPercentage}%`}
        />
      </div>

      <MonitorOverview monitors={monitors.slice(0, 5)} />

      <ActiveIncidents incidents={incidents} />
    </div>
  );
}

export default Dashboard;