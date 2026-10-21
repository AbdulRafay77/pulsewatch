function MonitorStats({ checks }) {
  const totalChecks = checks.length;

  const successfulChecks = checks.filter(
    (check) => check.success
  ).length;

  const uptime =
    totalChecks === 0
      ? null
      : (successfulChecks / totalChecks) * 100;

  const totalResponseTime = checks.reduce(
    (total, check) => total + check.responseTime,
    0
  );

  const averageResponseTime =
    totalChecks === 0
      ? null
      : Math.round(totalResponseTime / totalChecks);

  return (
    <section className="monitor-stats-section">
      <h2>Recent Statistics</h2>

      <div className="monitor-stats-grid">
        <div className="monitor-stat-card">
          <p className="monitor-stat-value">
            {totalChecks}
          </p>

          <p className="monitor-stat-label">
            Total Checks
          </p>
        </div>

        <div className="monitor-stat-card">
          <p className="monitor-stat-value">
            {successfulChecks}
          </p>

          <p className="monitor-stat-label">
            Successful Checks
          </p>
        </div>

        <div className="monitor-stat-card">
          <p className="monitor-stat-value">
            {uptime === null
              ? "N/A"
              : `${uptime.toFixed(2)}%`}
          </p>

          <p className="monitor-stat-label">
            Recent Uptime
          </p>
        </div>

        <div className="monitor-stat-card">
          <p className="monitor-stat-value">
            {averageResponseTime === null
              ? "N/A"
              : `${averageResponseTime} ms`}
          </p>

          <p className="monitor-stat-label">
            Average Response Time
          </p>
        </div>
      </div>
    </section>
  );
}

export default MonitorStats;