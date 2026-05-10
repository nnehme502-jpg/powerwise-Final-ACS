export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="stat-card">
      <p className="stat-title">{title}</p>
      <h2 className="stat-value">{value}</h2>
      <span className="stat-subtitle">{subtitle}</span>
    </div>
  );
}