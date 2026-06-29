import { useEffect, useState } from "react";
import { FiCheckSquare, FiAlertCircle, FiXCircle, FiActivity, FiSearch, FiCalendar, FiUser } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import auditService from "../../services/auditService";

function AuditVerification() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const data = await auditService.getAllAudits();
      setAudits(data || []);
    } catch (error) {
      console.log(error);
      setAudits([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats calculation
  const totalCount = audits.length;
  const pendingCount = audits.filter(a => a.action === "PENDING").length;
  const approvedCount = audits.filter(a => a.action === "APPROVED").length;
  const rejectedCount = audits.filter(a => a.action === "REJECTED").length;

  const filteredAudits = audits.filter(audit => {
    // Status Filter
    if (statusFilter !== "ALL" && audit.action !== statusFilter) {
      return false;
    }
    // Search Filter
    const vendorName = audit.emission?.vendor?.companyName?.toLowerCase() || "";
    const auditorName = audit.auditor?.name?.toLowerCase() || "";
    const categoryName = audit.emission?.category?.categoryName?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return vendorName.includes(search) || auditorName.includes(search) || categoryName.includes(search);
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          {/* Header */}
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Audit & Verification Registry</h2>
            <p style={{ marginTop: "4px", color: "var(--text-muted)" }}>
              Track verification actions, comments, and statuses for all disclosures.
            </p>
          </div>

          {/* Stats Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div className="premium-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiActivity size={24} />
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Total Disclosures</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "4px" }}>{totalCount}</h3>
              </div>
            </div>

            <div className="premium-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiAlertCircle size={24} />
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Pending Audits</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "4px" }}>{pendingCount}</h3>
              </div>
            </div>

            <div className="premium-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiCheckSquare size={24} />
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Verified & Approved</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "4px" }}>{approvedCount}</h3>
              </div>
            </div>

            <div className="premium-card" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <FiXCircle size={24} />
              </div>
              <div>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "500" }}>Rejected</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "4px" }}>{rejectedCount}</h3>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px"
          }}>
            {/* Search */}
            <div style={{ position: "relative", width: "300px" }}>
              <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search vendor, auditor or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "36px", height: "40px", width: "100%" }}
              />
            </div>

            {/* Status Tabs */}
            <div style={{
              display: "flex",
              backgroundColor: "var(--bg-app)",
              padding: "4px",
              borderRadius: "10px",
              border: "1px solid var(--border-color)"
            }}>
              {["ALL", "PENDING", "APPROVED", "REJECTED"].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    transition: "all 0.15s ease",
                    backgroundColor: statusFilter === status ? "var(--bg-sidebar)" : "transparent",
                    color: statusFilter === status ? "white" : "var(--text-main)"
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Table Container */}
          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : filteredAudits.length === 0 ? (
              <div style={{ padding: "45px", textAlign: "center", color: "var(--text-muted)" }}>
                No audited records found matching the criteria.
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Reporter (Supplier)</th>
                    <th>Customer (Buyer)</th>
                    <th>Category</th>
                    <th>Reporting Period</th>
                    <th>Total Emissions</th>
                    <th>Status</th>
                    <th>Auditor</th>
                    <th>Remarks</th>
                    <th>Audit Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudits.map((audit) => (
                    <tr key={audit.auditId}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>
                        {audit.emission?.vendor?.companyName || "System / Admin"}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--text-muted)" }}>
                        {audit.emission?.buyer?.companyName || "N/A"}
                      </td>
                      <td>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor: "var(--bg-app)",
                          border: "1px solid var(--border-color)"
                        }}>
                          {audit.emission?.category?.categoryName || "General"}
                        </span>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                          <FiCalendar size={13} color="var(--text-muted)" />
                          {audit.emission?.reportingMonth}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--text-main)" }}>
                          {(audit.emission?.totalEmission || 0).toLocaleString()}
                        </strong>{" "}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO2e</span>
                      </td>
                      <td>
                        <span className={`status-badge ${audit.action?.toLowerCase() || 'pending'}`}>
                          {audit.action || "PENDING"}
                        </span>
                      </td>
                      <td>
                        {audit.auditor ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                            <FiUser size={13} color="var(--text-muted)" />
                            {audit.auditor.name}
                          </span>
                        ) : (
                          <span style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.85rem" }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={audit.remarks}>
                        {audit.remarks || (
                          <span style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.85rem" }}>No remarks</span>
                        )}
                      </td>
                      <td>
                        {audit.auditedDate ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                            <FiCalendar size={13} />
                            {audit.auditedDate.split("T")[0]}
                          </span>
                        ) : (
                          <span style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.85rem" }}>--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditVerification;
