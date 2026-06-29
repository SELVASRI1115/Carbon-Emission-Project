import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FiActivity } from "react-icons/fi";
import loginBackdrop from "../../assets/login_backdrop.png";
import authService from "../../services/authService";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      setLoading(true);
      const response = await authService.login(formData);

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));

      showToast("Login Successful! Redirecting...", "success");
      
      setTimeout(() => {
        if (response.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else if (response.role === "AUDITOR") {
          navigate("/auditor/dashboard");
        } else {
          navigate("/vendor/dashboard");
        }
      }, 1000);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.response?.data || "Login Failed";
      showToast(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", overflow: "hidden" }}>
      
      {/* Left side - Backdrop & Slogans */}
      <div style={{
        flex: 1,
        position: "relative",
        backgroundImage: `url(${loginBackdrop})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px",
        color: "white"
      }}>
        {/* Overlay for branding and text legibility */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(135deg, rgba(6, 95, 70, 0.85) 0%, rgba(11, 25, 19, 0.9) 100%)",
          zIndex: 1
        }} />

        {/* Brand Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", zIndex: 2, position: "relative" }}>
          <FiActivity size={28} color="#34d399" />
          <span style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.02em" }}>Carbon Audit</span>
        </div>

        {/* Slogans */}
        <div style={{ zIndex: 2, position: "relative", maxWidth: "480px", marginBottom: "80px" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", lineHeight: "1.15", color: "white", marginBottom: "20px" }}>
            Enterprise Carbon Scope-3 Auditing Platform
          </h1>
          <p style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.8)", marginBottom: "8px", fontWeight: "500" }}>
            Track. Measure. Verify. Report.
          </p>
          <p style={{ fontSize: "1.05rem", color: "#34d399", fontWeight: "600" }}>
            Building a sustainable future together.
          </p>
        </div>

        <div style={{ zIndex: 2, position: "relative", fontSize: "0.85rem", color: "rgba(255,255,255,0.5)" }}>
          © 2026 Carbon Audit. All rights reserved.
        </div>
      </div>

      {/* Right side - Login Card */}
      <div style={{
        width: "500px",
        backgroundColor: "#f4f7f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px"
      }}>
        <div style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "white",
          padding: "40px 32px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          border: "1px solid #e5e7eb"
        }}>
          <h2 style={{ fontSize: "1.6rem", fontWeight: "700", color: "#1f2937", marginBottom: "6px" }}>Welcome Back!</h2>
          <p style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "28px" }}>Sign in to continue</p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                style={{ padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px" }}
              />
            </div>

            <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={{ padding: "12px 40px 12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", width: "100%" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot options */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "#4b5563" }}>
                <input type="checkbox" style={{ accentColor: "#047857", cursor: "pointer" }} />
                Remember me
              </label>
              <a href="#" style={{ color: "#047857", textDecoration: "none", fontWeight: "600" }}>Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backgroundColor: "#047857",
                marginTop: "10px"
              }}
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "0.85rem", color: "#4b5563" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#047857", fontWeight: "600", textDecoration: "none" }}>
              Register
            </Link>
          </p>
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

export default Login;