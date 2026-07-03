import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiPlus, FiDownload, FiEye, FiPlay } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import { getAllReports, triggerMonthlyReports } from "../../services/reportService";
import { getAllEmissions } from "../../services/emissionService";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [role, setRole] = useState("");
  const [triggering, setTriggering] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportEmissions, setReportEmissions] = useState([]);
  const [loadingEmissions, setLoadingEmissions] = useState(false);

  const getApiBaseUrl = () => {
    return window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://zestful-creativity-production-7065.up.railway.app";
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setRole(user.role);
    }
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await getAllReports();
      setReports(data || []);
    } catch (error) {
      console.log(error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (report) => {
    setSelectedReport(report);
    setLoadingEmissions(true);
    try {
      const all = await getAllEmissions();
      const filtered = all.filter(e => {
        const matchVendor = e.vendor?.vendorId === report.vendor?.vendorId;
        const matchMonth = !report.reportingMonth || e.reportingMonth === report.reportingMonth;
        return matchVendor && matchMonth;
      });
      setReportEmissions(filtered);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingEmissions(false);
    }
  };

  const handleTriggerMonthly = async () => {
    setTriggering(true);
    try {
      const generated = await triggerMonthlyReports();
      alert(`Successfully ran monthly scheduler! Generated ${generated.length || 0} reports.`);
      loadReports();
    } catch (error) {
      console.log(error);
      alert("Failed to run monthly scheduler");
    } finally {
      setTriggering(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.reportType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !monthFilter || report.reportingMonth === monthFilter;
    return matchesSearch && matchesMonth;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Reports</h2>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "12px", flex: 1 }}>
              <div style={{ position: "relative", width: "300px" }}>
                <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: "36px", height: "40px" }}
                />
              </div>

              <div style={{ position: "relative", width: "200px" }}>
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="form-input"
                  style={{ height: "40px" }}
                  title="Filter by Month"
                />
              </div>

              {monthFilter && (
                <button
                  onClick={() => setMonthFilter("")}
                  className="btn-secondary"
                  style={{ height: "40px", padding: "0 15px", cursor: "pointer" }}
                >
                  Clear Month
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              {role === "ADMIN" && (
                <button 
                  onClick={handleTriggerMonthly}
                  className="btn-secondary" 
                  style={{ height: "40px", cursor: "pointer" }}
                  disabled={triggering}
                >
                  <FiPlay /> {triggering ? "Running..." : "Run Monthly Scheduler"}
                </button>
              )}
            </div>
          </div>

          {/* Table Container */}
          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : filteredReports.length === 0 ? (
              <div style={{ padding: "45px", textAlign: "center", color: "var(--text-muted)" }}>
                No reports found.
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Type</th>
                    <th>Generated On</th>
                    <th>Generated By</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                   {filteredReports.map((report) => (
                    <tr key={report.reportId}>
                      <td 
                        style={{ fontWeight: "600", color: "var(--accent-color)", cursor: "pointer" }}
                        onClick={() => handleViewDetails(report)}
                      >
                        {report.reportName}
                      </td>
                      <td>{report.reportType}</td>
                      <td>{report.generatedDate || "01 Jun 2024"}</td>
                      <td>{report.vendor?.companyName || "Admin User"}</td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <a 
                            href={`${getApiBaseUrl()}/api/reports/download/${report.reportId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--text-muted)" }}
                            title="Download PDF"
                          >
                            <FiDownload size={16} />
                          </a>
                          <button 
                            onClick={() => handleViewDetails(report)}
                            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div className="premium-card animate-fade-in" style={{
            backgroundColor: "white",
            maxWidth: "750px",
            width: "100%",
            maxHeight: "85vh",
            overflowY: "auto",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid var(--border-color)", paddingBottom: "15px" }}>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700" }}>{selectedReport.reportName}</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Type: {selectedReport.reportType} | Scoped Month: {selectedReport.reportingMonth || "All Time"}
                </span>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text-muted)", padding: "0 5px" }}
              >
                &times;
              </button>
            </div>

            {/* Modal Actions */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Generated on: {selectedReport.generatedDate ? new Date(selectedReport.generatedDate).toLocaleString() : "N/A"}
              </div>
              <a 
                href={`${getApiBaseUrl()}/api/reports/download/${selectedReport.reportId}`}
                className="btn-primary"
                style={{ height: "36px", padding: "0 16px", textDecoration: "none", fontSize: "0.85rem" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiDownload size={14} /> Download PDF
              </a>
            </div>

            {/* Emissions Details Table */}
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "600", marginBottom: "12px", color: "var(--text-main)" }}>Detailed Emissions Log</h4>
              {loadingEmissions ? (
                <div style={{ padding: "30px", textAlign: "center" }}><Loader /></div>
              ) : reportEmissions.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>No emissions logged for this scope.</p>
              ) : (
                <div style={{ overflowX: "auto", border: "1px solid var(--border-color)", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#fafbfc", borderBottom: "1px solid var(--border-color)" }}>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)" }}>Category</th>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)" }}>Month</th>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "right" }}>Activity Data</th>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "right" }}>EF</th>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "right" }}>Total (tCO2e)</th>
                        <th style={{ padding: "10px 14px", color: "var(--text-muted)", textAlign: "center" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportEmissions.map((e) => (
                        <tr key={e.emissionId} style={{ borderBottom: "1px solid var(--border-color)" }}>
                          <td style={{ padding: "10px 14px" }}>{e.category?.categoryName || "N/A"}</td>
                          <td style={{ padding: "10px 14px" }}>{e.reportingMonth}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right" }}>{e.activityData}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right" }}>{e.emissionFactor}</td>
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: "600" }}>{e.totalEmission ? e.totalEmission.toFixed(2) : "0.00"}</td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            <span className={`status-badge ${e.status?.toLowerCase() === "approved" ? "active" : e.status?.toLowerCase() === "rejected" ? "inactive" : "pending"}`}>
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border-color)", paddingTop: "15px", marginTop: "10px" }}>
              <button 
                onClick={() => setSelectedReport(null)}
                className="btn-secondary"
                style={{ height: "38px", padding: "0 20px", cursor: "pointer" }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;