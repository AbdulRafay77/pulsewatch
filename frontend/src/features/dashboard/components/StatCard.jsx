function StatCard({ title, value, tone = "" }) {
  const className = tone
    ? `stat-card stat-card-${tone}`
    : "stat-card";

  return (
    <div className={className}>
      <h3>{title}</h3>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}

export default StatCard;