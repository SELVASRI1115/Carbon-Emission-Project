import { useEffect, useState } from "react";
import { FiDownload, FiEye, FiSearch } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";

import reportService from "../../services/reportService";
import { getAllEmissions } from "../../services/emissionService";

function Reports() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportEmissions, setReportEmissions] = useState([]);
  const [loadingEmissions, setLoadingEmissions] = useState(false);

  const getApiBaseUrl = () => {
    return window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://zestful-creativity-production-7065.up.railway.app";
  };

  useEffect(() => {

    loadReports();

  }, []);

  const loadReports =
    async () => {

      try {

        const data =
          await reportService
            .getAllReports();

        setReports(data || []);

      } catch (error) {

        console.log(error);

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

  const filteredReports = reports.filter(report => {
    const isOwner = report.vendor?.user?.id === user?.id;
    if (!isOwner) return false;

    const matchesSearch = !searchTerm || 
      report.reportName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportType?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMonth = !monthFilter || report.reportingMonth === monthFilter;
    return matchesSearch && matchesMonth;
  });

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F4F6F8"
      }}
    >

      <Sidebar />

      <div
        style={{
          flex: 1
        }}
      >

        <Navbar />

        <div
          style={{
            padding: "25px"
          }}
        >

          <h2>
            Reports
          </h2>

          {/* Search and Action Bar */}
          <div style={{ display: "flex", gap: "12px", marginTop: "20px", alignItems: "center" }}>
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

          <div
            style={{
              background: "white",
              marginTop: "20px",
              borderRadius: "12px",
              padding: "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            {

              loading ?

              (

                <h3>
                  Loading...
                </h3>

              )

              : filteredReports.length === 0 ?

              (

                <h3 style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px" }}>
                  No reports found.
                </h3>

              )

              :

              (

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse"
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#E8F5E9"
                      }}
                    >

                      <th style={{padding:"12px"}}>
                        Report Name
                      </th>

                      <th style={{padding:"12px"}}>
                        Report Type
                      </th>

                      <th style={{padding:"12px"}}>
                        Vendor
                      </th>

                      <th style={{padding:"12px"}}>
                        File Path
                      </th>

                      <th style={{padding:"12px"}}>
                        Generated Date
                      </th>

                      <th style={{padding:"12px", textAlign:"center"}}>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      filteredReports.map(
                        (report) => (

                          <tr
                            key={
                              report.reportId
                            }
                          >

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee",
                                color: "var(--accent-color)",
                                fontWeight: "600",
                                cursor: "pointer"
                              }}
                              onClick={() => handleViewDetails(report)}
                            >
                              {
                                report.reportName
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.reportType
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.vendor
                                  ?.companyName
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.filePath
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.generatedDate
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee",
                                textAlign:"center"
                              }}
                            >
                              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                                <a 
                                  href={`${getApiBaseUrl()}/api/reports/download/${report.reportId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#2E7D32" }}
                                  title="Download PDF"
                                >
                                  <FiDownload size={18} />
                                </a>
                                <button 
                                  onClick={() => handleViewDetails(report)}
                                  style={{ background: "none", border: "none", color: "#2E7D32", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}
                                  title="View Details"
                                >
                                  <FiEye size={18} />
                                </button>
                              </div>
                            </td>

                          </tr>

                        )
                      )

                    }

                  </tbody>

                </table>

              )

            }

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
                <h3 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-main)" }}>{selectedReport.reportName}</h3>
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