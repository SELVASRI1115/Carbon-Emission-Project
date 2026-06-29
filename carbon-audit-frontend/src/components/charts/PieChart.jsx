import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function CustomPieChart({ data = [], total = "0.00" }) {
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4"];
  
  // Format data with color colors
  const formattedData = data.map((item, index) => ({
    name: item.name,
    value: Math.round(item.value * 100) / 100, // round to 2 decimal places
    percent: item.percent,
    fill: colors[index % colors.length]
  }));

  // Fallback if no data is present
  const displayData = formattedData.length > 0 ? formattedData : [
    { name: "No Data Filed", value: 1, fill: "#e5e7eb", percent: 100 }
  ];

  return (
    <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)" }}>
        Emissions by Category
      </h3>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "240px" }}>
        {/* Donut Chart with center text */}
        <div style={{ width: "55%", height: "100%", position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value.toLocaleString()} kg CO2e (${props.payload.percent ? props.payload.percent.toFixed(1) : 0}%)`,
                  name
                ]}
                contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px", color: "var(--text-main)" }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text showing total emissions */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none",
            width: "120px"
          }}>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)", lineHeight: "1.2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={total}>
              {total}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", marginTop: "2px" }}>
              kg CO₂e
            </div>
          </div>
        </div>

        {/* Legend Panel */}
        <div style={{ width: "45%", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", paddingRight: "5px" }}>
          {formattedData.length === 0 ? (
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
              Submit emissions to view breakdown
            </div>
          ) : (
            formattedData.map((item, index) => (
              <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "500", color: "var(--text-main)", overflow: "hidden" }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: item.fill, display: "inline-block", flexShrink: 0 }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90px" }} title={item.name}>
                    {item.name}
                  </span>
                </div>
                <span style={{ color: "var(--text-muted)", fontWeight: "600", flexShrink: 0 }}>
                  {item.percent ? item.percent.toFixed(1) : 0}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomPieChart;