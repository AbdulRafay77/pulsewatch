import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function ResponseTimeChart({ checks }) {
  const chartData = checks
    .slice()
    .reverse()
    .map((check) => ({
      time: new Date(check.checkedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      responseTime: check.responseTime
    }));

  return (
    <section className="response-chart-section">
      <h2>Response Time</h2>

      {chartData.length === 0 ? (
        <p className="chart-empty">
          No response-time data yet.
        </p>
      ) : (
        <div className="response-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid
                stroke="#e6e6e6"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="time"
                tick={{
                  fontSize: 11,
                  fill: "#615d59"
                }}
                axisLine={{
                  stroke: "#e6e6e6"
                }}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#615d59"
                }}
                axisLine={false}
                tickLine={false}
                width={55}
              />

              <Tooltip
                formatter={(value) => [
                  `${value} ms`,
                  "Response Time"
                ]}
              />

              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#0f766e"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#0f766e"
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default ResponseTimeChart;