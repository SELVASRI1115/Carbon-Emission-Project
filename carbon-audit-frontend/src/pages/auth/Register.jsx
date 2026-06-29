import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiLock, FiShield, FiActivity, FiArrowRight } from "react-icons/fi";
import authService from "../../services/authService";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      showToast("Please select a role", "error");
      return;
    }

    if (formData.password.length < 6) {
      showToast("Password must contain at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await authService.register(formData);
      showToast("Registration Successful! Redirecting...", "success");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data || "Registration Failed";
      showToast(errMsg, "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Modern glassmorphism layout with ecological geometric background
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at 10% 20%, rgba(4, 120, 87, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(16, 185, 129, 0.15) 0%, transparent 40%), #05080e",
    position: "relative",
    overflow: "hidden",
    padding: "20px"
  };

  const backdropCircle1 = {
    position: "absolute",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.03) 100%)",
    top: "-100px",
    left: "-100px",
    filter: "blur(60px)",
    pointerEvents: "none"
  };

  const backdropCircle2 = {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 100%)",
    bottom: "-150px",
    right: "-150px",
    filter: "blur(70px)",
    pointerEvents: "none"
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "480px",
    backgroundColor: "rgba(17, 24, 39, 0.7)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    padding: "40px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(12px)",
    zIndex: 2,
    animation: "fadeIn 0.5s ease"
  };

  const headerLogoStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    color: "#34d399",
    fontSize: "1.8rem",
    fontWeight: "800",
    letterSpacing: "-0.03em",
    marginBottom: "8px"
  };

  const inputWrapperStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center"
  };

  const inputIconStyle = {
    position: "absolute",
    left: "14px",
    color: "rgba(255, 255, 255, 0.4)",
    pointerEvents: "none"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px 12px 44px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
    outline: "none"
  };

  const selectStyle = {
    width: "100%",
    padding: "12px 16px 12px 44px",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.95rem",
    transition: "all 0.25s ease",
    outline: "none",
    cursor: "pointer",
    appearance: "none"
  };

  // Add dynamic input focus border glow
  const handleFocus = (e) => {
    e.target.style.borderColor = "#34d399";
    e.target.style.boxShadow = "0 0 0 3px rgba(52, 211, 153, 0.2)";
    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.07)";
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
    e.target.style.boxShadow = "none";
    e.target.style.backgroundColor = "rgba(255, 255, 255, 0.04)";
  };

  return (
    <div style={containerStyle}>
      <div style={backdropCircle1} />
      <div style={backdropCircle2} />

      <div style={cardStyle}>
        <div style={headerLogoStyle}>
          <FiActivity size={28} />
          <span>Carbon Audit</span>
        </div>

        <p style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", marginBottom: "28px", fontSize: "0.95rem" }}>
          Create an account to register emissions.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem", fontWeight: "600" }}>Full Name</label>
            <div style={inputWrapperStyle}>
              <FiUser style={inputIconStyle} size={18} />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem", fontWeight: "600" }}>Corporate Email</label>
            <div style={inputWrapperStyle}>
              <FiMail style={inputIconStyle} size={18} />
              <input
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem", fontWeight: "600" }}>Secure Password</label>
            <div style={inputWrapperStyle}>
              <FiLock style={inputIconStyle} size={18} />
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.85rem", fontWeight: "600" }}>Select Account Role</label>
            <div style={inputWrapperStyle}>
              <FiShield style={inputIconStyle} size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
                style={selectStyle}
              >
                <option value="" style={{ backgroundColor: "#111827" }}>-- Choose Role --</option>
                <option value="VENDOR" style={{ backgroundColor: "#111827" }}>Vendor (Reporting entity)</option>
                <option value="AUDITOR" style={{ backgroundColor: "#111827" }}>Auditor (Validating entity)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: "14px",
              borderRadius: "12px",
              fontSize: "1rem",
              marginTop: "16px",
              width: "100%",
              fontWeight: "700"
            }}
          >
            {loading ? "Registering Profile..." : "Register Profile"} <FiArrowRight />
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", color: "rgba(255, 255, 255, 0.4)", fontSize: "0.9rem" }}>
          Already have an account?
          <Link
            to="/login"
            style={{
              marginLeft: "6px",
              color: "#34d399",
              fontWeight: "600",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              transition: "border-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.borderBottomColor = "#34d399"}
            onMouseLeave={(e) => e.target.style.borderBottomColor = "transparent"}
          >
            Secure Login
          </Link>
        </p>
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

export default Register;