import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

import vendorService from "../../services/vendorService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const response = await vendorService.getAllVendors();
      setVendors(response || []);
    } catch (error) {
      console.log(error);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await vendorService.deleteVendor(id);
      alert("Vendor Deleted Successfully");
      loadVendors();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>Companies Directory</h2>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ position: "relative", width: "300px" }}>
              <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: "36px", height: "40px" }}
              />
            </div>

            <Link to="/admin/add-vendor" className="btn-primary" style={{ height: "40px" }}>
              <FiPlus /> Add Company
            </Link>
          </div>

          {/* Table Container */}
          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : filteredVendors.length === 0 ? (
              <div style={{ padding: "45px", textAlign: "center", color: "var(--text-muted)" }}>
                No companies found.
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Type</th>
                    <th>Industry</th>
                    <th>Status</th>
                    <th>Total Emissions (kg CO₂e)</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.vendorId}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{vendor.companyName}</td>
                      <td>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor: vendor.companyType === "CUSTOMER" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: vendor.companyType === "CUSTOMER" ? "#3b82f6" : "#10b981",
                          border: "1px solid transparent"
                        }}>
                          {vendor.companyType || "SUPPLIER"}
                        </span>
                      </td>
                      <td>{vendor.industry}</td>
                      <td>
                        <span className={`status-badge ${vendor.status?.toLowerCase() || 'active'}`}>
                          {vendor.status || "Active"}
                        </span>
                      </td>
                      <td>
                        <strong>{(vendor.totalCarbonEmission || 0).toLocaleString()}</strong>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                            <FiEye size={16} />
                          </button>
                          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                            <FiEdit size={16} />
                          </button>
                          <button 
                            onClick={() => deleteVendor(vendor.vendorId)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444" }}
                          >
                            <FiTrash2 size={16} />
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
    </div>
  );
}

export default Vendors;