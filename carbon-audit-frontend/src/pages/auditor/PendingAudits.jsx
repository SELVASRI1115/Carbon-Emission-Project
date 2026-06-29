import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckSquare, FiAlertCircle } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import auditService from "../../services/auditService";

function PendingAudits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const data = await auditService.getPendingRecords();
      setAudits(data);
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
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Pending Climate Audits</h2>
              <p style={{ marginTop: "4px" }}>Verify emissions data submitted by vendors for validation.</p>
            </div>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "var(--status-pending-bg)",
              color: "var(--status-pending-text)",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              <FiAlertCircle />
              {audits.length} Pending Verification{audits.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : audits.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <FiCheckSquare size={48} color="var(--accent-color)" style={{ marginBottom: "16px" }} />
                <h3>All Clear!</h3>
                <p style={{ marginTop: "8px" }}>There are no pending audits to review at this moment.</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Vendor</th>
                    <th>Category</th>
                    <th>Activity Data</th>
                    <th>Reporting Month</th>
                    <th>Action State</th>
                    <th>Actions</th>
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
                          {audit.emission?.totalEmission || 0}
                        </strong>{" "}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO2e</span>
                      </td>
                      <td>{audit.emission?.reportingMonth}</td>
                      <td>
                        <span className="status-badge pending">
                          {audit.action}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate("/auditor/review-audit", { state: audit })}
                          className="btn-primary"
                          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                        >
                          Review Audit
                        </button>
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

export default PendingAudits;