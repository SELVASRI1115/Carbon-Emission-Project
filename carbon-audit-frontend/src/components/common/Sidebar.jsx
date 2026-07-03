import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FiGrid, 
  FiUsers, 
  FiWind, 
  FiActivity, 
  FiFileText, 
  FiShield, 
  FiSettings, 
  FiLogOut,
  FiList
} from "react-icons/fi";
import { RiLeafLine } from "react-icons/ri";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const activePath = location.pathname;

  const isActive = (path) => activePath === path;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Paths mapping based on roles
  const getRoutes = () => {
    const role = user?.role;
    if (role === "ADMIN") {
      return [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FiGrid size={18} /> },
        { name: "Companies", path: "/admin/vendors", icon: <FiUsers size={18} /> },
        { name: "Emissions", path: "/admin/emissions", icon: <FiWind size={18} /> },
        { name: "Categories", path: "/admin/add-category", icon: <FiList size={18} /> },
        { name: "Analytics", path: "/admin/analytics", icon: <FiActivity size={18} /> },
        { name: "Reports", path: "/admin/reports", icon: <FiFileText size={18} /> },
        { name: "Audit & Verification", path: "/admin/audit-verification", icon: <FiShield size={18} /> },
        { name: "Users", path: "/admin/users", icon: <FiUsers size={18} /> },
        { name: "Settings", path: "/admin/settings", icon: <FiSettings size={18} /> }
      ];
    } else if (role === "VENDOR") {
      return [
        { name: "Dashboard", path: "/vendor/dashboard", icon: <FiGrid size={18} /> },
        { name: "Submit Emission", path: "/vendor/submit-emission", icon: <FiWind size={18} /> },
        { name: "My Emissions", path: "/vendor/my-emissions", icon: <FiWind size={18} /> },
        { name: "Analytics", path: "/vendor/analytics", icon: <FiActivity size={18} /> },
        { name: "Reports", path: "/vendor/reports", icon: <FiFileText size={18} /> },
        { name: "Settings", path: "/vendor/settings", icon: <FiSettings size={18} /> }
      ];
    } else if (role === "AUDITOR") {
      return [
        { name: "Dashboard", path: "/auditor/dashboard", icon: <FiGrid size={18} /> },
        { name: "Pending Audits", path: "/auditor/pending-audits", icon: <FiShield size={18} /> },
        { name: "Audit History", path: "/auditor/audit-history", icon: <FiFileText size={18} /> },
        { name: "Reports", path: "/auditor/reports", icon: <FiFileText size={18} /> },
        { name: "Analytics", path: "/auditor/analytics", icon: <FiActivity size={18} /> },
        { name: "Settings", path: "/auditor/settings", icon: <FiSettings size={18} /> }
      ];
    }
    return [];
  };

  const routes = getRoutes();

  const sidebarStyle = {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: "var(--bg-sidebar)",
    color: "rgba(255, 255, 255, 0.65)",
    padding: "32px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    zIndex: 10
  };

  const logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "0 12px 20px 12px",
    color: "white",
    fontSize: "1.25rem",
    fontWeight: "700",
    letterSpacing: "-0.02em"
  };

  const getLinkStyle = (path) => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: isActive(path) ? "white" : "rgba(255, 255, 255, 0.65)",
    backgroundColor: isActive(path) ? "rgba(255, 255, 255, 0.08)" : "transparent",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "0.92rem",
    transition: "all 0.15s ease",
    borderLeft: isActive(path) ? "4px solid #10b981" : "4px solid transparent"
  });

  return (
    <div style={sidebarStyle}>
      {/* Brand Header */}
      <div style={logoStyle}>
        <RiLeafLine size={24} color="#10b981" />
        <span>Carbon Audit</span>
      </div>

      {/* Menu Links */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
        {routes.map((route, i) => (
          <Link key={i} to={route.path} style={getLinkStyle(route.path)} className="sidebar-link">
            <span style={{ color: isActive(route.path) ? "#10b981" : "inherit", display: "flex", alignItems: "center" }}>
              {route.icon}
            </span>
            {route.name}
          </Link>
        ))}
      </div>

      {/* Logout Action at Bottom */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
        <button 
          onClick={logout}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "none",
            border: "none",
            color: "rgba(255, 255, 255, 0.65)",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "0.92rem",
            fontWeight: "500",
            textAlign: "left",
            transition: "all 0.15s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "rgba(255, 255, 255, 0.65)";
          }}
        >
          <FiLogOut size={18} color="rgba(255, 255, 255, 0.65)" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;