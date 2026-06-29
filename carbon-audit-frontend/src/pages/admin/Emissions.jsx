import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiCalendar, FiMapPin, FiWind } from "react-icons/fi";

import { getAllEmissions, deleteEmission } from "../../services/emissionService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";

function Emissions() {
  const [emissions, setEmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmissions();
  }, []);

  const loadEmissions = async () => {
    try {
      const data = await getAllEmissions();
      setEmissions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this emission record?")) return;
    try {
      await deleteEmission(id);
      alert("Emission Deleted Successfully");
      loadEmissions();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role="ADMIN" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Emission Inventory</h2>
              <p style={{ marginTop: "4px" }}>Manage and view carbon audit logs filed across all active accounts.</p>
            </div>

            <Link to="/admin/add-emission" className="btn-primary">
              <FiPlus /> Add Emission Record
            </Link>
          </div>

          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : emissions.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No emission records found. Create one by clicking "Add Emission Record".
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Reporter (Supplier)</th>
                    <th>Customer (Buyer)</th>
                    <th>Category</th>
                    <th>Activity Data</th>
                    <th>Factor</th>
                    <th>Calculated Footprint</th>
                    <th>Reporting Period</th>
                    <th>Verification Status</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emissions.map((emission) => (
                    <tr key={emission.emissionId}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>
                        {emission.vendor?.companyName || "System / Admin"}
                      </td>
                      <td style={{ fontWeight: "600", color: "var(--text-muted)" }}>
                        {emission.buyer?.companyName || "N/A"}
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
                          {emission.category?.categoryName || "General"}
                        </span>
                      </td>
                      <td>{emission.activityData?.toLocaleString()}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                        {emission.emissionFactor?.toFixed(4)}
                      </td>
                      <td>
                        <strong style={{ color: "var(--text-main)" }}>
                          {(emission.totalEmission || 0).toLocaleString()}
                        </strong>{" "}
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>kg CO2e</span>
                      </td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.9rem" }}>
                          <FiCalendar size={13} color="var(--text-muted)" />
                          {emission.reportingMonth}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${emission.status?.toLowerCase() || 'pending'}`}>
                          {emission.status || "PENDING"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(emission.emissionId)}
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

export default Emissions;