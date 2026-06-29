import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiX, FiFileText } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import auditService from "../../services/auditService";

function ReviewAudit() {
  const navigate = useNavigate();
  const location = useLocation();
  const audit = location.state;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [remarks, setRemarks] = useState("");

  if (!audit) {
    return (
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <div style={{ padding: "40px", textAlign: "center" }}>
            <h3>No Audit Record Selected</h3>
            <button onClick={() => navigate("/auditor/pending-audits")} className="btn-primary" style={{ marginTop: "20px" }}>
              Back to Pending Audits
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      await auditService.approveRecord(audit.auditId, {
        auditorId: currentUser.id,
        remarks: remarks
      });
      alert("Audit Approved Successfully");
      navigate("/auditor/pending-audits");
    } catch (error) {
      console.log(error);
      alert("Approval Failed");
    }
  };

  const handleReject = async () => {
    try {
      await auditService.rejectRecord(audit.auditId, {
        auditorId: currentUser.id,
        remarks: remarks
      });
      alert("Audit Rejected Successfully");
      navigate("/auditor/pending-audits");
    } catch (error) {
      console.log(error);
      alert("Rejection Failed");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          <button 
            onClick={() => navigate("/auditor/pending-audits")} 
            style={{ 
              background: "transparent", 
              border: "none", 
              color: "var(--text-muted)", 
              display: "flex", 
              alignItems: "center", 
              gap: "8px", 
              cursor: "pointer",
              marginBottom: "24px",
              fontSize: "0.95rem",
              fontWeight: "600"
            }}
          >
            <FiArrowLeft /> Back to Pending Audits
          </button>

          <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
            {/* Details Panel */}
            <div className="premium-card" style={{ flex: 2, minWidth: "350px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "16px" }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "var(--accent-light)",
                  color: "var(--accent-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <FiFileText size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Audit Verification Details</h3>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600" }}>Verifying submitted emission profile</span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Vendor Company</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-main)" }}>{audit.emission?.vendor?.companyName || "N/A"}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Emission Category</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-main)" }}>{audit.emission?.category?.categoryName || "N/A"}</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Activity Data</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-main)" }}>{audit.emission?.activityData || 0} units</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Emission Factor</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-main)" }}>{audit.emission?.emissionFactor || 0} kg/unit</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", gridColumn: "span 2" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Reporting Month</span>
                  <span style={{ fontSize: "1.05rem", fontWeight: "600", color: "var(--text-main)" }}>{audit.emission?.reportingMonth}</span>
                </div>

                <div style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: "6px", 
                  gridColumn: "span 2", 
                  padding: "16px", 
                  borderRadius: "12px", 
                  backgroundColor: "var(--bg-app)",
                  border: "1px solid var(--border-color)",
                  marginTop: "10px"
                }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Calculated Footprint</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--accent-color)" }}>
                    {(audit.emission?.totalEmission || 0).toLocaleString()} <span style={{ fontSize: "1rem", fontWeight: "500", color: "var(--text-muted)" }}>kg CO2e</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Decisions Panel */}
            <div className="premium-card" style={{ flex: 1.2, minWidth: "300px", display: "flex", flexDirection: "column", gap: "24px" }}>
              <div>
                <h3 style={{ marginBottom: "8px" }}>Auditor Verdict</h3>
                <p>Provide validation notes and render your final approval/rejection status.</p>
              </div>

              <div className="form-group">
                <label>Validation Remarks & Feedback</label>
                <textarea
                  rows="6"
                  className="form-input"
                  placeholder="Enter detailed auditor remarks regarding this emission submission..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ resize: "vertical", minHeight: "120px" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                <button
                  onClick={handleApprove}
                  className="btn-primary"
                  style={{ flex: 1, padding: "14px 20px" }}
                >
                  <FiCheck /> Approve Audit
                </button>

                <button
                  onClick={handleReject}
                  className="btn-danger"
                  style={{ flex: 1, padding: "14px 20px" }}
                >
                  <FiX /> Reject Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewAudit;