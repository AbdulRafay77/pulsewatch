function MonitorStats({ checks }) {
  const totalChecks = checks.length;

  const successfulChecks = checks.filter(
    (check) => check.success
  ).length;

  const uptime =
    totalChecks === 0
      ? 0
      : (successfulChecks / totalChecks) * 100;

  const totalResponseTime = checks.reduce(
    (total, check) => total + check.responseTime,
    0
  );

  const averageResponseTime =
    totalChecks === 0
      ? 0
      : Math.round(totalResponseTime / totalChecks);

  return (
    <div>
      <h2>Monitor Statistics</h2>

      <p>Total Checks: {totalChecks}</p>

      <p>
        Successful Checks: {successfulChecks}
      </p>

      <p>
        Recent Uptime: {uptime.toFixed(2)}%
      </p>

      <p>
        Average Response Time: {averageResponseTime} ms
      </p>
    </div>
  );
}

export default MonitorStats;