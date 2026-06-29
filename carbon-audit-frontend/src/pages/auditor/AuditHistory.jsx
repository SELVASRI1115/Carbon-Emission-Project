import { useEffect, useState } from "react";
import { FiCheckSquare, FiCalendar, FiBookOpen } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import auditService from "../../services/auditService";
import Loader from "../../components/common/Loader";

function AuditHistory() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditHistory();
  }, []);

  const loadAuditHistory = async () => {
    try {
      const data = await auditService.getAllAudits();
      const completedAudits = data.filter(
        audit => audit.action === "APPROVED" || audit.action === "REJECTED"
      );
      setAudits(completedAudits);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Validation History</h2>
              <p style={{ marginTop: "4px" }}>Archive of all certified and audited emission records.</p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "var(--accent-light)",
              color: "var(--accent-color)",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              <FiBookOpen />
              {audits.length} Records Certified
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : audits.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <FiCalendar size={48} color="var(--text-muted)" style={{ marginBottom: "16px" }} />
                <h3>No Audit History</h3>
                <p style={{ marginTop: "8px" }}>No validation actions have been completed yet.</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Calculated Footprint</th>
                    <th>Validation State</th>
                    <th>Auditor Remarks</th>
                    <th>Audited Date</th>
                  </tr>
                </thead>
                <tbody>
                  {audits.map((audit) => (
                    <tr key={audit.auditId}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>
                        {audit.emission?.vendor?.companyName || "N/A"}
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
                          {audit.emission?.category?.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: "var(--text-main)" }}>
                          {(audit.emission?.totalEmission || 0).toLocaleString()}
                        </strong>{" "}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO2e</span>
                      </td>
                      <td>
                        <span className={`status-badge ${audit.action?.toLowerCase()}`}>
                          {audit.action}
                        </span>
                      </td>
                      <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={audit.remarks}>
                        {audit.remarks || (
                          <span style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.85rem" }}>No comments</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <FiCalendar size={13} />
                          {audit.auditedDate?.replace("T", " ")}
                        </span>
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

export default AuditHistory;