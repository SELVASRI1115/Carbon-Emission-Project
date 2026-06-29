import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function CustomLineChart({ data = [] }) {
  // Fallback if no data is present
  const displayData = data.length > 0 ? data : [
    { name: "No Data", value: 0 }
  ];

  return (
    <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
          Emissions Overview
        </h3>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO₂e</span>
      </div>

      <div style={{ height: "240px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="emissionsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="name" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: "500" }} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickFormatter={(value) => {
                if (value >= 1000) return `${value / 1000}k`;
                return value;
              }}
            />
            <Tooltip 
              formatter={(value) => [`${value.toLocaleString()} kg CO2e`, 'Emissions']}
              contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px", color: "var(--text-main)" }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#047857" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#emissionsGradient)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default CustomLineChart;