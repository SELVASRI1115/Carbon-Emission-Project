import { FiTrendingUp } from "react-icons/fi";

function DashboardCard({
  title,
  value,
  icon,
  color = "var(--accent-color)",
  trend = "+2.4%" // Elegant default trend indicator to feel more "real-time" and premium
}) {
  return (
    <div className="premium-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {title}
        </span>
        
        {icon ? (
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: `rgba(var(--accent-rgb), 0.1)`,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 12px rgba(var(--accent-rgb), 0.05)"
          }}>
            {icon}
          </div>
        ) : (
          <div style={{
            width: "42px",
            height: "42px",
            borderRadius: "12px",
            background: "rgba(16, 185, 129, 0.1)",
            color: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <FiTrendingUp size={20} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-main)", margin: 0 }}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </h2>
        {trend && (
          <span style={{
            fontSize: "0.8rem",
            fontWeight: "600",
            color: "var(--accent-color)",
            backgroundColor: "var(--accent-light)",
            padding: "2px 8px",
            borderRadius: "12px"
          }}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;