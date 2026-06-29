import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiPlus } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import categoryService from "../../services/categoryService";
import vendorService from "../../services/vendorService";
import emissionService from "../../services/emissionService";

function AddEmission() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [unit, setUnit] = useState("kWh");

  const [formData, setFormData] = useState({
    vendorId: "",
    categoryId: "",
    activityData: "",
    emissionFactor: "",
    reportingMonth: "",
    description: "",
    status: "PENDING"
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const categoryData = await categoryService.getAllCategories();
      const vendorData = await vendorService.getAllVendors();
      setCategories(categoryData || []);
      setVendors(vendorData || []);
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
    
    let factor = 1.0;
    if (selectedCat) {
      const name = selectedCat.categoryName.toLowerCase();
      if (name.includes("electricity") || name.includes("power")) factor = 0.385;
      else if (name.includes("fuel") || name.includes("gas") || name.includes("diesel") || name.includes("petrol")) factor = 8.887;
      else if (name.includes("travel") || name.includes("flight") || name.includes("transport")) factor = 0.142;
      else if (name.includes("waste") || name.includes("supply") || name.includes("material")) factor = 50.0;
      else factor = 1.25;
    }

    setFormData(prev => ({
      ...prev,
      categoryId: catId,
      emissionFactor: String(factor)
    }));
  };

  const activityVal = Number(formData.activityData) || 0;
  const factorVal = Number(formData.emissionFactor) || 0;
  const totalEmission = activityVal * factorVal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendorId || !formData.categoryId) {
      alert("Please select a vendor and category");
      return;
    }

    try {
      await emissionService.addEmission({
        ...formData,
        activityData: activityVal,
        emissionFactor: factorVal
      });

      alert("Emission Added Successfully");
      navigate("/admin/emissions");
    } catch (error) {
      console.log(error);
      alert("Failed To Add Emission");
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
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((vendor) => (
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
                      <option value="kWh">kWh</option>
                      <option value="MWh">MWh</option>
                      <option value="Gal">Gal</option>
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
                <Link to="/admin/emissions" style={{ 
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
    </div>
  );
}

export default AddEmission;