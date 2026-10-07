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

  if (chartData.length === 0) {
    return <p>No response-time data yet.</p>;
  }

  return (
    <div>
      <h2>Response Time</h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />

            <YAxis
              label={{
                value: "ms",
                angle: -90,
                position: "insideLeft"
              }}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="responseTime"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ResponseTimeChart;