import { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { FiDownload, FiCalendar, FiActivity } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import { getAllEmissions } from "../../services/emissionService";
import vendorService from "../../services/vendorService";

function Analytics() {
  const [activeTab, setActiveTab] = useState("trend");
  const [emissions, setEmissions] = useState([]);
  const [roleFilteredEmissions, setRoleFilteredEmissions] = useState([]);
  const [allEmissions, setAllEmissions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [myVendor, setMyVendor] = useState(null);
  const [dateRange, setDateRange] = useState("all");

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      setUser(currentUser);
      
      const allEmissionsData = await getAllEmissions();
      const allVendors = await vendorService.getAllVendors();
      
      setAllEmissions(allEmissionsData || []);
      setVendors(allVendors || []);

      let filtered = allEmissionsData || [];
      if (currentUser && currentUser.role === "VENDOR") {
        const profile = allVendors.find(v => v.user?.id === currentUser.id);
        setMyVendor(profile || null);
        if (profile) {
          filtered = allEmissionsData.filter(e => e.vendor?.vendorId === profile.vendorId);
        } else {
          filtered = [];
        }
      }
      setRoleFilteredEmissions(filtered);
      setEmissions(filtered);
    } catch (error) {
      console.log("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    
    if (range === "all") {
      setEmissions(roleFilteredEmissions);
      return;
    }
    
    const now = new Date();
    let cutOffYear = now.getFullYear();
    let cutOffMonth = now.getMonth();
    
    if (range === "3months") {
      cutOffMonth -= 3;
    } else if (range === "6months") {
      cutOffMonth -= 6;
    } else if (range === "12months") {
      cutOffMonth -= 12;
    }
    
    while (cutOffMonth < 0) {
      cutOffMonth += 12;
      cutOffYear -= 1;
    }
    
    const filtered = roleFilteredEmissions.filter(e => {
      if (!e.reportingMonth || !e.reportingMonth.includes("-")) return false;
      const parts = e.reportingMonth.split("-");
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      
      return (y > cutOffYear) || (y === cutOffYear && m >= cutOffMonth);
    });
    
    setEmissions(filtered);
  };

  const getTrendData = () => {
    const map = {};
    emissions.forEach(e => {
      const month = e.reportingMonth || "Unknown";
      const val = Number(e.totalEmission) || 0;
      map[month] = (map[month] || 0) + val;
    });

    const sortedMonths = Object.keys(map).sort();
    return sortedMonths.map(month => {
      let label = month;
      if (month.includes("-")) {
        const parts = month.split("-");
        const year = parts[0];
        const m = parseInt(parts[1], 10);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (m >= 1 && m <= 12) {
          label = `${monthNames[m - 1]} ${year.slice(2)}`;
        }
      }
      return {
        name: label,
        value: Math.round(map[month] * 100) / 100
      };
    });
  };

  const getVendorData = () => {
    // For VENDOR role, they can compare their emissions to others
    const dataList = user?.role === "VENDOR" ? allEmissions : emissions;
    const map = {};
    dataList.forEach(e => {
      const name = e.vendor?.companyName || "System / Admin";
      const val = Number(e.totalEmission) || 0;
      map[name] = (map[name] || 0) + val;
    });
    return Object.keys(map).map(name => ({
      name,
      value: Math.round(map[name] * 100) / 100
    })).sort((a, b) => b.value - a.value);
  };

  const getCategoryData = () => {
    const map = {};
    let totalSum = 0;
    emissions.forEach(e => {
      const name = e.category?.categoryName || "General";
      const val = Number(e.totalEmission) || 0;
      map[name] = (map[name] || 0) + val;
      totalSum += val;
    });

    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#ef4444", "#06b6d4"];
    return Object.keys(map).map((name, index) => {
      const val = map[name];
      return {
        name,
        value: Math.round(val * 100) / 100,
        percent: totalSum > 0 ? Math.round((val / totalSum) * 1000) / 10 : 0,
        fill: colors[index % colors.length]
      };
    }).sort((a, b) => b.value - a.value);
  };

  const handleExportDetails = () => {
    if (emissions.length === 0) {
      alert("No emissions data available to export.");
      return;
    }

    const headers = ["Emission ID", "Category", "Reporting Month", "Activity Data", "Emission Factor", "Total Emission (kg CO2e)", "Vendor Company", "Status"];
    const rows = emissions.map(e => [
      e.emissionId,
      `"${e.category?.categoryName || 'General'}"`,
      `"${e.reportingMonth || 'N/A'}"`,
      e.activityData || 0,
      e.emissionFactor || 0,
      e.totalEmission || 0,
      `"${e.vendor?.companyName || 'N/A'}"`,
      `"${e.status || 'N/A'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `carbon_emissions_analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { id: "trend", label: "Emissions Trend" },
    { id: "vendor", label: "Vendor Comparison" },
    { id: "category", label: "Category Breakdown" }
  ];

  if (loading) {
    return <Loader />;
  }

  const totalEmissionsVal = emissions.reduce((acc, curr) => acc + (curr.totalEmission || 0), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Analytics</h2>
              <p style={{ marginTop: "4px" }}>
                {user?.role === "VENDOR" 
                  ? `Detailed ecological analysis for ${myVendor?.companyName || "your account"}.` 
                  : "Detailed ecological carbon insights across all registered vendors."}
              </p>
            </div>
            
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 8px",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                backgroundColor: "white",
                fontSize: "0.9rem",
                color: "var(--text-main)",
                fontWeight: "500",
                height: "40px"
              }}>
                <FiCalendar style={{ color: "var(--text-muted)" }} />
                <select
                  value={dateRange}
                  onChange={(e) => handleDateRangeChange(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "none",
                    color: "var(--text-main)",
                    fontWeight: "500",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    paddingRight: "10px"
                  }}
                >
                  <option value="all">All-Time Data</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                </select>
              </div>

              <button 
                onClick={handleExportDetails}
                className="btn-primary" 
                style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", cursor: "pointer" }}
              >
                <FiDownload /> Export Details
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{ 
            display: "flex", 
            borderBottom: "1px solid var(--border-color)", 
            gap: "24px", 
            marginBottom: "30px",
            fontSize: "0.95rem"
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 4px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "3px solid #10b981" : "3px solid transparent",
                  color: activeTab === tab.id ? "#10b981" : "var(--text-muted)",
                  fontWeight: activeTab === tab.id ? "600" : "500",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {emissions.length === 0 ? (
            <div className="premium-card" style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
              <FiActivity size={48} color="var(--accent-color)" style={{ marginBottom: "16px" }} />
              <h3>No Emissions Logged</h3>
              <p style={{ marginTop: "10px" }}>There are no verified or pending carbon records to display analytics.</p>
            </div>
          ) : (
            <>
              {activeTab === "trend" && (
                <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                      Emissions Trend Over Time
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO₂e</span>
                  </div>

                  <div style={{ height: "380px", width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getTrendData()} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                        <defs>
                          <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: "500" }} 
                        />
                        <YAxis 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value.toLocaleString()} kg CO2e`, 'Emissions']}
                          contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px" }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#trendGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "vendor" && (
                <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                      Emissions by Vendor Comparison
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO₂e</span>
                  </div>

                  <div style={{ height: "380px", width: "100%" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getVendorData()} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "var(--text-muted)", fontSize: 12, fontWeight: "500" }} 
                        />
                        <YAxis 
                          tickLine={false} 
                          axisLine={false} 
                          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
                          tickFormatter={(value) => `${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value.toLocaleString()} kg CO2e`, 'Emissions']}
                          contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px" }}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[4, 4, 0, 0]} 
                          maxBarSize={45}
                        >
                          {getVendorData().map((entry, index) => {
                            const isSelf = myVendor && entry.name === myVendor.companyName;
                            const barFill = isSelf ? "#10b981" : (myVendor ? "#9ca3af" : "#047857");
                            return <Cell key={`cell-${index}`} fill={barFill} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "category" && (
                <div className="premium-card animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--text-main)", marginBottom: "4px" }}>
                      Emissions Category Breakdown
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Percentage of Total Footprint</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "350px", gap: "40px" }}>
                    <div style={{ width: "50%", height: "100%", position: "relative" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getCategoryData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {getCategoryData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value, name, props) => [
                              `${value.toLocaleString()} kg CO2e (${props.payload.percent}%)`,
                              name
                            ]}
                            contentStyle={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-color)", borderRadius: "8px" }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Center Text */}
                      <div style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                        pointerEvents: "none"
                      }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-main)", lineHeight: "1.2" }}>
                          {totalEmissionsVal.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "500", marginTop: "4px" }}>
                          Total kg CO₂e
                        </div>
                      </div>
                    </div>

                    {/* Legend Panel */}
                    <div style={{ width: "50%", display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto", maxHeight: "300px", paddingRight: "10px" }}>
                      {getCategoryData().map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.95rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "500", color: "var(--text-main)" }}>
                            <span style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: item.fill, display: "inline-block" }} />
                            <span>{item.name}</span>
                          </div>
                          <span style={{ color: "var(--text-muted)", fontWeight: "600" }}>
                            {item.percent.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
