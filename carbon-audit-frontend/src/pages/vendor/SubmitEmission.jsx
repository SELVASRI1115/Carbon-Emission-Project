import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import categoryService from "../../services/categoryService";
import vendorService from "../../services/vendorService";
import emissionService from "../../services/emissionService";

function SubmitEmission() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [unit, setUnit] = useState("kWh");
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    vendorId: "",
    buyerId: "",
    categoryId: "",
    activityData: "",
    emissionFactor: "",
    reportingMonth: "",
    description: "",
    status: "PENDING"
  });

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const categoryData = await categoryService.getAllCategories();
      const vendorData = await vendorService.getAllVendors();
      setCategories(categoryData || []);
      setVendors(vendorData || []);
      
      // Auto-select vendor if current user is vendor
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentUser(user);
      if (user && user.vendorId) {
        setFormData(prev => ({
          ...prev,
          vendorId: String(user.vendorId)
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const selectedCat = categories.find(c => String(c.categoryId) === String(catId));
    
    if (selectedCat) {
      const name = selectedCat.categoryName.toLowerCase();
      if (name.includes("electricity") || name.includes("power")) {
        setUnit("kWh");
      } else if (name.includes("fuel") || name.includes("diesel") || name.includes("petrol") || name.includes("gas")) {
        setUnit("L");
      } else if (name.includes("travel") || name.includes("flight") || name.includes("transport")) {
        setUnit("Miles");
      } else if (name.includes("waste") || name.includes("supply") || name.includes("material")) {
        setUnit("Tons");
      }
    }

    setFormData(prev => ({
      ...prev,
      categoryId: catId
    }));
  };

  useEffect(() => {
    if (!formData.categoryId) return;
    
    const selectedCat = categories.find(c => String(c.categoryId) === String(formData.categoryId));
    if (!selectedCat) return;

    const name = selectedCat.categoryName.toLowerCase();
    let factor = 1.25;

    if (name.includes("electricity") || name.includes("power")) {
      if (unit === "MWh") factor = 385.0;
      else factor = 0.385;
    } 
    else if (name.includes("fuel") || name.includes("diesel") || name.includes("petrol") || name.includes("gas")) {
      if (unit === "L") factor = 2.68;
      else if (unit === "Gal") factor = 10.21;
      else if (unit === "kg") factor = 2.98;
      else if (unit === "kWh") factor = 0.185;
      else factor = 2.68;
    } 
    else if (name.includes("travel") || name.includes("flight") || name.includes("transport")) {
      factor = 0.142;
    } 
    else if (name.includes("waste") || name.includes("supply") || name.includes("material")) {
      factor = 50.0;
    }

    setFormData(prev => ({
      ...prev,
      emissionFactor: String(factor)
    }));
  }, [formData.categoryId, unit, categories]);

  const activityVal = Number(formData.activityData) || 0;
  const factorVal = Number(formData.emissionFactor) || 0;
  const totalEmission = activityVal * factorVal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendorId || !formData.categoryId) {
      showToast("Please select a vendor and category", "error");
      return;
    }

    try {
      await emissionService.addEmission({
        ...formData,
        activityData: activityVal,
        emissionFactor: factorVal
      });

      showToast("Emission Submitted Successfully!", "success");
      setTimeout(() => {
        navigate("/vendor/my-emissions");
      }, 1500);
    } catch (error) {
      console.log(error);
      const errMsg = error.response?.data?.message || error.response?.data || "Failed To Submit Emission";
      showToast(errMsg, "error");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          
          {/* Breadcrumb / Header */}
          <div style={{ marginBottom: "24px" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: "500" }}>
              Emissions / Add Emission Data
            </span>
            <h2 style={{ fontSize: "1.6rem", fontWeight: "700", marginTop: "4px" }}>Add Emission Data</h2>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            
            {/* Left side card - Form fields */}
            <div className="premium-card" style={{ flex: 2, minWidth: "350px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                
                {/* Vendor selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Vendor *</label>
                  <select
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ height: "42px" }}
                    disabled={currentUser && currentUser.role === "VENDOR"}
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
                      <option key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.companyName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer / Buyer selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Customer / Buyer *</label>
                  <select
                    name="buyerId"
                    value={formData.buyerId}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ height: "42px" }}
                  >
                    <option value="">Select Buyer Company</option>
                    {vendors
                      .filter(vendor => vendor.companyType === "CUSTOMER")
                      .map((vendor) => (
                        <option key={vendor.vendorId} value={vendor.vendorId}>
                          {vendor.companyName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Reporting Month */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Reporting Month *</label>
                  <input
                    type="month"
                    name="reportingMonth"
                    value={formData.reportingMonth}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ height: "42px" }}
                  />
                </div>

                {/* Category Selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Category *</label>
                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleCategoryChange}
                    required
                    className="form-input"
                    style={{ height: "42px" }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Data & Unit */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Activity Data *</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="number"
                      name="activityData"
                      placeholder="Enter activity data"
                      value={formData.activityData}
                      onChange={handleChange}
                      required
                      className="form-input"
                      style={{ flex: 2, height: "42px" }}
                    />
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, height: "42px", minWidth: "80px" }}
                    >
                      <option value="L">L (Liters)</option>
                      <option value="Gal">Gal (Gallons)</option>
                      <option value="kg">kg (Kilograms)</option>
                      <option value="kWh">kWh</option>
                      <option value="MWh">MWh</option>
                      <option value="Miles">Miles</option>
                      <option value="Tons">Tons</option>
                    </select>
                  </div>
                </div>

                {/* Emission Factor */}
                <div className="form-group" style={{ marginBottom: 0, gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Emission Factor (kg CO₂e/unit) *</label>
                  <input
                    type="number"
                    step="0.0001"
                    name="emissionFactor"
                    placeholder="Enter emission factor"
                    value={formData.emissionFactor}
                    onChange={handleChange}
                    required
                    className="form-input"
                    style={{ height: "42px" }}
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ marginBottom: 0, gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Description (Optional)</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-input"
                    style={{ resize: "vertical" }}
                  />
                </div>

              </div>
            </div>

            {/* Right side - Estimate box matching reference image */}
            <div style={{ flex: 1.1, minWidth: "280px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="premium-card" style={{ 
                backgroundColor: "#f0fdf4", 
                border: "1px solid #d1fae5", 
                display: "flex", 
                flexDirection: "column", 
                gap: "24px" 
              }}>
                <div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: "700", color: "#065f46" }}>Estimated Emission</h3>
                </div>

                <div>
                  <div style={{ fontSize: "2.2rem", fontWeight: "800", color: "#047857" }}>
                    {totalEmission.toFixed(2)}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#065f46", fontWeight: "600", marginTop: "2px" }}>
                    kg CO₂e
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #d1fae5", paddingTop: "16px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#065f46", textTransform: "uppercase" }}>Calculation Preview</span>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px", fontSize: "0.82rem", color: "#065f46", fontWeight: "600" }}>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(6, 95, 70, 0.7)" }}>Activity Data</div>
                      <div style={{ fontSize: "0.95rem", marginTop: "2px" }}>{activityVal.toLocaleString()}</div>
                    </div>
                    <div>x</div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(6, 95, 70, 0.7)" }}>Emission Factor</div>
                      <div style={{ fontSize: "0.95rem", marginTop: "2px" }}>{factorVal}</div>
                    </div>
                    <div>=</div>
                    <div>
                      <div style={{ fontSize: "0.7rem", color: "rgba(6, 95, 70, 0.7)" }}>Emission</div>
                      <div style={{ fontSize: "0.95rem", marginTop: "2px" }}>{totalEmission.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "10px" }}>
                <Link to="/vendor/my-emissions" style={{ 
                  backgroundColor: "white", 
                  color: "var(--text-main)", 
                  border: "1px solid var(--border-color)", 
                  padding: "10px 18px", 
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center"
                }}>
                  Cancel
                </Link>
                <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>
                  Calculate & Save
                </button>
              </div>

            </div>

          </form>

        </div>
      </div>

      {toast.show && (
        <div style={{
          position: "fixed",
          top: "24px",
          right: "24px",
          zIndex: 9999,
          padding: "16px 24px",
          borderRadius: "12px",
          background: toast.type === "success" ? "rgba(6, 78, 59, 0.95)" : "rgba(153, 27, 27, 0.95)",
          color: "white",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
          border: `1px solid ${toast.type === "success" ? "#10b981" : "#ef4444"}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontWeight: "600",
          fontSize: "0.95rem",
          backdropFilter: "blur(8px)",
          animation: "slideIn 0.3s ease-out forwards",
        }}>
          {toast.type === "success" ? (
            <span style={{ fontSize: "1.2rem", color: "#34d399" }}>✓</span>
          ) : (
            <span style={{ fontSize: "1.2rem", color: "#f87171" }}>⚠</span>
          )}
          {toast.message}
        </div>
      )}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default SubmitEmission;