import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiCalendar, FiMapPin, FiWind } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import emissionService from "../../services/emissionService";

function MyEmissions() {
  const [emissions, setEmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmissions();
  }, []);

  const loadEmissions = async () => {
    try {
      const data = await emissionService.getMyEmissions();
      setEmissions(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this emission submission?")) return;
    try {
      await emissionService.deleteEmission(id);
      alert("Emission Deleted Successfully");
      loadEmissions();
    } catch (error) {
      console.log(error);
      alert("Delete Failed");
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
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>My Filed Emissions</h2>
              <p style={{ marginTop: "4px" }}>View and manage energy filings submitted for auditor verification.</p>
            </div>

            <Link to="/vendor/submit-emission" className="btn-primary">
              <FiPlus /> File New Emission
            </Link>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : emissions.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
                <FiWind size={48} color="var(--accent-color)" style={{ marginBottom: "16px" }} />
                <h3>No Submissions</h3>
                <p style={{ marginTop: "8px" }}>You have not submitted any emissions records yet.</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Customer / Buyer</th>
                    <th>Category</th>
                    <th>Activity Data</th>
                    <th>Emission Factor</th>
                    <th>Total Emissions</th>
                    <th>Reporting Month</th>
                    <th>Audit Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emissions.map((item) => (
                    <tr key={item.emissionId}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>
                        {item.buyer?.companyName || "N/A"}
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
                          {item.category?.categoryName || "Uncategorized"}
                        </span>
                      </td>
                      <td>{item.activityData?.toLocaleString()}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        {item.emissionFactor?.toFixed(4)}
                      </td>
                      <td>
                        <strong style={{ color: "var(--text-main)" }}>
                          {(item.totalEmission || 0).toLocaleString()}
                        </strong>{" "}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO2e</span>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                          <FiCalendar size={13} color="var(--text-muted)" />
                          {item.reportingMonth}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${item.status?.toLowerCase() || 'pending'}`}>
                          {item.status || "PENDING"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(item.emissionId)}
                          className="btn-danger"
                          style={{
                            padding: "6px 12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.85rem"
                          }}
                        >
                          <FiTrash2 size={13} /> Delete
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

export default MyEmissions;