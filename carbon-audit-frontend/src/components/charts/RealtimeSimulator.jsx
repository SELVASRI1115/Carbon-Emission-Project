import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, PieChart, Pie, Legend } from "recharts";
import { FiWind, FiSliders, FiHelpCircle, FiCheckCircle } from "react-icons/fi";

function RealtimeSimulator() {
  const [electricity, setElectricity] = useState(120000); // kWh
  const [fuel, setFuel] = useState(25000); // Gallons
  const [travel, setTravel] = useState(150000); // Miles
  const [waste, setWaste] = useState(1500); // Tons

  // Carbon factors
  const FACTOR_ELEC = 0.385; // kg CO2e / kWh
  const FACTOR_FUEL = 8.887; // kg CO2e / gal
  const FACTOR_TRAVEL = 0.142; // kg CO2e / mile
  const FACTOR_WASTE = 50.0; // kg CO2e / ton

  // Calculate scopes
  const scope1 = Math.round(fuel * FACTOR_FUEL);
  const scope2 = Math.round(electricity * FACTOR_ELEC);
  const scope3 = Math.round((travel * FACTOR_TRAVEL) + (waste * FACTOR_WASTE));
  const total = scope1 + scope2 + scope3;

  // Chart data
  const data = [
    { name: "Scope 1 (Direct)", value: scope1, fill: "#10b981", desc: "Fleet Fuel & Gas" },
    { name: "Scope 2 (Indirect)", value: scope2, fill: "#3b82f6", desc: "Purchased Power" },
    { name: "Scope 3 (Value Chain)", value: scope3, fill: "#8b5cf6", desc: "Travel & Supply Chain" }
  ];

  // Dynamic score card
  const getScoreInfo = () => {
    if (total < 100000) return { grade: "A+", color: "#10b981", text: "Net Zero Ready" };
    if (total < 250000) return { grade: "A", color: "#059669", text: "High Efficiency" };
    if (total < 500000) return { grade: "B", color: "#eab308", text: "Moderate Impact" };
    if (total < 800000) return { grade: "C", color: "#f97316", text: "Elevated Emissions" };
    return { grade: "D", color: "#ef4444", text: "Action Required" };
  };

  const getRecommendation = () => {
    const max = Math.max(scope1, scope2, scope3);
    if (max === scope1) {
      return "Scope 1 (Direct) is your primary driver. Focus on transitioning your fleet to electric vehicles and auditing natural gas installations.";
    }
    if (max === scope2) {
      return "Scope 2 (Electricity) dominates. Switch to green power tariffs, invest in virtual power purchases (VPPAs), or fit rooftop solar arrays.";
    }
    return "Scope 3 (Value Chain) is highest. Focus on business travel offsets, supporting remote work, and setting strict vendor procurement rules.";
  };

  const score = getScoreInfo();

  return (
    <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", gridColumn: "span 2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FiSliders size={20} color="var(--accent-color)" />
          <h3 style={{ margin: 0 }}>Real-Time Carbon Simulator</h3>
        </div>
        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
          <FiWind /> Adjust inputs to simulate carbon offsets live
        </span>
      </div>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {/* Sliders Control Panel */}
        <div style={{ flex: 1, minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Electricity Usage</label>
              <span style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.9rem" }}>{electricity.toLocaleString()} kWh</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="10000" 
              value={electricity} 
              onChange={(e) => setElectricity(Number(e.target.value))} 
              style={{ accentColor: "var(--accent-color)", cursor: "pointer", width: "100%" }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Scope 2 Indirect (Electricity, heating/cooling)</span>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Fleet & Boiler Fuel</label>
              <span style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.9rem" }}>{fuel.toLocaleString()} Gallons</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="200000" 
              step="2000" 
              value={fuel} 
              onChange={(e) => setFuel(Number(e.target.value))} 
              style={{ accentColor: "var(--accent-color)", cursor: "pointer", width: "100%" }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Scope 1 Direct (Company combustion facilities)</span>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Business Travel</label>
              <span style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.9rem" }}>{travel.toLocaleString()} Miles</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1000000" 
              step="10000" 
              value={travel} 
              onChange={(e) => setTravel(Number(e.target.value))} 
              style={{ accentColor: "var(--accent-color)", cursor: "pointer", width: "100%" }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Scope 3 Upstream (Flights, hotel stays, commuting)</span>
          </div>

          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label>Supply Chain Material & Waste</label>
              <span style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.9rem" }}>{waste.toLocaleString()} Tons</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="20000" 
              step="200" 
              value={waste} 
              onChange={(e) => setWaste(Number(e.target.value))} 
              style={{ accentColor: "var(--accent-color)", cursor: "pointer", width: "100%" }}
            />
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Scope 3 Downstream (Suppliers, end-of-life disposal)</span>
          </div>
        </div>

        {/* Real-Time Chart & Insights Panel */}
        <div style={{ flex: 1.2, minWidth: "350px", display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Main stats display */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Total Footprint</div>
              <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--text-main)", marginTop: "6px" }}>
                {total.toLocaleString()} <span style={{ fontSize: "0.85rem", fontWeight: "500", color: "var(--text-muted)" }}>kg CO2e</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "12px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", minWidth: "150px" }}>
              <div style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: score.color,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "1.4rem",
                boxShadow: `0 4px 10px rgba(0,0,0,0.1)`
              }}>
                {score.grade}
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>{score.text}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Climate Rating</div>
              </div>
            </div>
          </div>

          {/* Recharts Pie Chart representation */}
          <div style={{ height: "180px", position: "relative" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value.toLocaleString()} kg CO2e`, 'Emissions']}
                  contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px", color: "var(--text-main)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Off-set</span>
              <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-main)" }}>
                {Math.round(((scope1+scope2)/total)*100 || 0)}%
              </div>
            </div>
          </div>

          {/* Color Indicators */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", borderTop: "1px solid var(--border-color)", paddingTop: "12px" }}>
            {data.map((entry, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", color: "var(--text-main)" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: entry.fill }} />
                  {entry.name.split(" ")[0]}
                </span>
                <span style={{ color: "var(--text-muted)", paddingLeft: "14px" }}>
                  {Math.round((entry.value / total) * 100 || 0)}%
                </span>
              </div>
            ))}
          </div>

          {/* Recommendation alert */}
          <div style={{ 
            padding: "12px 16px", 
            borderRadius: "10px", 
            backgroundColor: "var(--bg-app)",
            borderLeft: `4px solid ${score.color}`,
            fontSize: "0.85rem",
            lineHeight: "1.5",
            color: "var(--text-muted)"
          }}>
            <strong style={{ color: "var(--text-main)", display: "block", marginBottom: "4px" }}>Simulation Verdict:</strong>
            {getRecommendation()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RealtimeSimulator;
