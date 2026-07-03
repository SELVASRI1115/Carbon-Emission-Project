import { useEffect, useState } from "react";
import { 
  FiUsers, 
  FiWind, 
  FiFileText, 
  FiAlertTriangle, 
  FiBell,
  FiCalendar
} from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import DashboardCard from "../../components/common/DashboardCard";
import Loader from "../../components/common/Loader";

import CustomPieChart from "../../components/charts/PieChart";
import CustomLineChart from "../../components/charts/LineChart";

import dashboardService from "../../services/dashboardService";
import emissionService from "../../services/emissionService";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalEmissions: 0,
    totalReports: 0,
    approvedAudits: 0,
    rejectedAudits: 0,
    pendingAudits: 0,
    totalCarbonEmission: 0
  });

  const [categoriesBreakdown, setCategoriesBreakdown] = useState([]);
  const [emissionsTrend, setEmissionsTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [allEmissions, setAllEmissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const summary = await dashboardService.getDashboardSummary();
      setDashboard(summary);

      // Query only the logged-in vendor's emissions
      const emissionsList = await emissionService.getMyEmissions();
      setAllEmissions(emissionsList || []);
      
      filterEmissionsByMonth(emissionsList || [], "");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmissionsByMonth = (emissionsList, month) => {
    let filtered = emissionsList || [];
    if (month) {
      filtered = emissionsList.filter(e => e.reportingMonth === month);
    }
    
    const processed = processEmissionsData(filtered);
    setCategoriesBreakdown(processed.categoryData);
    setEmissionsTrend(processed.trendData);
    
    setDashboard(prev => ({
      ...prev,
      totalCarbonEmission: processed.totalCarbon
    }));
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    filterEmissionsByMonth(allEmissions, month);
  };

  const getUniqueMonths = () => {
    const months = new Set();
    allEmissions.forEach(e => {
      if (e.reportingMonth) {
        months.add(e.reportingMonth);
      }
    });
    return Array.from(months).sort();
  };

  const processEmissionsData = (emissionsList) => {
    if (!emissionsList || emissionsList.length === 0) {
      return { categoryData: [], trendData: [], totalCarbon: 0 };
    }

    // 1. Group by category
    const categoriesMap = {};
    let totalSum = 0;
    emissionsList.forEach(e => {
      const catName = e.category?.categoryName || "Uncategorized";
      const value = Number(e.totalEmission) || 0;
      categoriesMap[catName] = (categoriesMap[catName] || 0) + value;
      totalSum += value;
    });

    const categoryData = Object.keys(categoriesMap).map(name => {
      const val = categoriesMap[name];
      return {
        name,
        value: val,
        percent: totalSum > 0 ? (val / totalSum) * 100 : 0
      };
    }).sort((a, b) => b.value - a.value);

    // 2. Group by month
    const monthsMap = {};
    emissionsList.forEach(e => {
      const month = e.reportingMonth || "Unknown";
      const value = Number(e.totalEmission) || 0;
      monthsMap[month] = (monthsMap[month] || 0) + value;
    });

    const sortedMonths = Object.keys(monthsMap).sort();
    const trendData = sortedMonths.map(month => {
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
        value: monthsMap[month]
      };
    });

    return { categoryData, trendData, totalCarbon: totalSum };
  };

  if (loading) {
    return <Loader />;
  }

  const carbonEmissionTotal = dashboard?.totalCarbonEmission || 0;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Custom Navbar matching top right of reference dashboard */}
        <div style={{
          background: "white",
          borderBottom: "1px solid var(--border-color)",
          padding: "16px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          {/* Dashboard Title */}
          <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--text-main)" }}>
            Dashboard
          </h2>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Date Range Selector */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid var(--border-color)",
              backgroundColor: "white",
              fontSize: "0.82rem",
              color: "var(--text-muted)",
              fontWeight: "500",
              height: "36px"
            }}>
              <FiCalendar style={{ color: "var(--text-muted)" }} />
              <select
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                style={{
                  border: "none",
                  outline: "none",
                  background: "none",
                  color: "var(--text-main)",
                  fontWeight: "500",
                  cursor: "pointer",
                  fontSize: "0.82rem"
                }}
              >
                <option value="">All-Time Data</option>
                {getUniqueMonths().map(m => {
                  let label = m;
                  if (m.includes("-")) {
                    const parts = m.split("-");
                    const year = parts[0];
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    const mIdx = parseInt(parts[1], 10) - 1;
                    if (mIdx >= 0 && mIdx < 12) {
                      label = `${monthNames[mIdx]} ${year}`;
                    }
                  }
                  return <option key={m} value={m}>{label}</option>;
                })}
              </select>
            </div>

            {/* Notification Bell */}
            <button style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: "4px"
            }}>
              <FiBell size={20} />
            </button>

            {/* Vendor Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "600",
                color: "#065f46"
              }}>
                VU
              </div>
              <div style={{ textAlign: "left", lineHeight: "1.2" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)" }}>Vendor User</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Vendor</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          
          {/* Reference Image Cards */}
          <div className="dashboard-grid">
            <DashboardCard
              title="Total Emissions"
              value={carbonEmissionTotal.toLocaleString()}
              icon={<FiWind size={20} />}
              color="#10b981"
              trend="▲ 8.5% vs Apr 2024"
            />

            <DashboardCard
              title="Total Vendors"
              value={dashboard?.totalVendors || 0}
              icon={<FiUsers size={20} />}
              color="#3b82f6"
              trend="▲ 5 New vendors"
            />

            <DashboardCard
              title="Pending Approvals"
              value={dashboard?.pendingAudits || 0}
              icon={<FiAlertTriangle size={20} />}
              color="#f59e0b"
              trend="▲ 3.2% vs Apr 2024"
            />

            <DashboardCard
              title="Reports Generated"
              value={dashboard?.totalReports || 0}
              icon={<FiFileText size={20} />}
              color="#8b5cf6"
              trend="▲ 2 New reports"
            />
          </div>

          {/* Charts Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
            <CustomLineChart data={emissionsTrend} />
            <CustomPieChart data={categoriesBreakdown} total={carbonEmissionTotal.toLocaleString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;