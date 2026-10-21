function MonitorStats({ checks }) {
  const totalChecks = checks.length;

  const successfulChecks = checks.filter((check) => check.success).length;

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
    <section>
      <h2>Recent Statistics</h2>

      <div>
        <div>
          <strong>{totalChecks}</strong>
          <p>Total Checks</p>
        </div>

        <div>
          <strong>{successfulChecks}</strong>
          <p>Successful Checks</p>
        </div>

        <div>
          <strong>
            {uptime === null ? "N/A" : `${uptime.toFixed(2)}%`}
          </strong>
          <p>Recent Uptime</p>
        </div>

        <div>
          <strong>
            {averageResponseTime === null
              ? "N/A"
              : `${averageResponseTime} ms`}
          </strong>
          <p>Average Response Time</p>
        </div>
      </div>
    </section>
  );
}

export default MonitorStats;