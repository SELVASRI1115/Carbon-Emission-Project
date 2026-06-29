import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon, FiSettings, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";

function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const user = JSON.parse(localStorage.getItem("user"));

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigateToProfile = () => {
    setShowMenu(false);
    if (user?.role === "ADMIN") navigate("/admin/profile");
    else if (user?.role === "VENDOR") navigate("/vendor/profile");
    // Auditor doesn't have profile route, fallback to settings
    else if (user?.role === "AUDITOR") navigate("/auditor/settings");
  };

  const navigateToSettings = () => {
    setShowMenu(false);
    if (user?.role === "ADMIN") navigate("/admin/settings");
    else if (user?.role === "VENDOR") navigate("/vendor/settings");
    else if (user?.role === "AUDITOR") navigate("/auditor/settings");
  };

  const navbarStyle = {
    background: "var(--bg-card)",
    borderBottom: "1px solid var(--border-color)",
    padding: "16px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 5,
    boxShadow: "var(--shadow-sm)",
    transition: "background-color 0.3s ease, border-color 0.3s ease"
  };

  const rightSectionStyle = {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  };

  const iconBtnStyle = {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };

  const profileTriggerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease"
  };

  const dropdownStyle = {
    position: "absolute",
    top: "60px",
    right: "32px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    color: "var(--text-main)",
    width: "180px",
    borderRadius: "12px",
    boxShadow: "var(--shadow-lg)",
    padding: "6px",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    animation: "fadeIn 0.2s ease"
  };

  const dropdownItemStyle = {
    padding: "10px 12px",
    cursor: "pointer",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "0.9rem",
    fontWeight: "500",
    color: "var(--text-main)",
    transition: "all 0.15s ease"
  };

  return (
    <div style={navbarStyle}>
      <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "var(--text-main)" }}>
        Climate Audit Console
      </h2>

      <div style={rightSectionStyle}>
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme} 
          style={iconBtnStyle}
          className="navbar-icon-btn"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <FiMoon size={18} />
          ) : (
            <FiSun size={18} color="var(--accent-color)" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            style={profileTriggerStyle}
            className="profile-trigger"
          >
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-light)",
              border: "1px solid var(--accent-color)",
              color: "var(--accent-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)" }}>
              {user?.name || "Profile"}
            </span>
            <FiChevronDown size={14} color="var(--text-muted)" />
          </button>

          {showMenu && (
            <div style={dropdownStyle}>
              {user?.role !== "AUDITOR" && (
                <div 
                  onClick={navigateToProfile}
                  style={dropdownItemStyle}
                  className="dropdown-item"
                >
                  <FiUser size={15} color="var(--text-muted)" />
                  Profile
                </div>
              )}

              <div 
                onClick={navigateToSettings}
                style={dropdownItemStyle}
                className="dropdown-item"
              >
                <FiSettings size={15} color="var(--text-muted)" />
                Settings
              </div>

              <div 
                onClick={logout}
                style={{ ...dropdownItemStyle, color: "#ef4444" }}
                className="dropdown-item logout"
              >
                <FiLogOut size={15} />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;