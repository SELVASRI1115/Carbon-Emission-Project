import { useEffect, useState } from "react";
import { FiUser, FiMail, FiShield, FiLogOut, FiSettings, FiBell, FiGlobe } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import userService from "../services/userService";

function Settings() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("profile");

  useEffect(() => {
    if (currentUser) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await userService.getUserById(currentUser.id);
      const data = response.value ? response.value : response;
      setUser({
        name: data.name || "",
        email: data.email || "",
        role: data.role || ""
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value
    });
  };

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(currentUser.id, user);
      
      // Update local storage
      const updatedUser = { ...currentUser, name: user.name, email: user.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert("Settings Updated Successfully");
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>Settings</h2>

          {loading ? (
            <Loader />
          ) : (
            <div style={{ 
              display: "flex", 
              gap: "30px", 
              flexWrap: "wrap",
              alignItems: "flex-start"
            }}>
              {/* Settings Nav Panel */}
              <div className="premium-card" style={{ 
                width: "250px", 
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <button
                  onClick={() => setActiveSubTab("profile")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: activeSubTab === "profile" ? "var(--accent-light)" : "transparent",
                    color: activeSubTab === "profile" ? "var(--accent-color)" : "var(--text-muted)",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <FiUser size={18} />
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={() => setActiveSubTab("preferences")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: activeSubTab === "preferences" ? "var(--accent-light)" : "transparent",
                    color: activeSubTab === "preferences" ? "var(--accent-color)" : "var(--text-muted)",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <FiSettings size={18} />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={() => setActiveSubTab("security")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "100%",
                    padding: "12px 16px",
                    border: "none",
                    borderRadius: "8px",
                    background: activeSubTab === "security" ? "var(--accent-light)" : "transparent",
                    color: activeSubTab === "security" ? "var(--accent-color)" : "var(--text-muted)",
                    fontWeight: "600",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease"
                  }}
                >
                  <FiShield size={18} />
                  <span>Security & Session</span>
                </button>
              </div>

              {/* Settings Content Area */}
              <div className="premium-card" style={{ flex: 1, minWidth: "300px", maxWidth: "650px", padding: "30px" }}>
                {activeSubTab === "profile" && (
                  <div className="animate-fade-in">
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "24px" }}>
                      Account Information
                    </h3>

                    <form onSubmit={saveChanges} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {/* Name */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", display: "block", marginBottom: "6px" }}>Full Name</label>
                        <div style={{ position: "relative" }}>
                          <FiUser style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                          <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            style={{ paddingLeft: "42px", height: "42px" }}
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)", display: "block", marginBottom: "6px" }}>Email Address</label>
                        <div style={{ position: "relative" }}>
                          <FiMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                          <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            style={{ paddingLeft: "42px", height: "42px" }}
                          />
                        </div>
                      </div>

                      {/* Role */}
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>Access Role (Read-Only)</label>
                        <div style={{ position: "relative" }}>
                          <FiShield style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                          <input
                            type="text"
                            value={user.role}
                            readOnly
                            className="form-input"
                            style={{ paddingLeft: "42px", height: "42px", backgroundColor: "var(--bg-app)", color: "var(--text-muted)" }}
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn-primary" style={{ height: "42px", padding: "0 24px", alignSelf: "flex-start", marginTop: "10px" }}>
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}

                {activeSubTab === "preferences" && (
                  <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                      System Preferences
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <FiGlobe style={{ color: "var(--accent-color)" }} />
                          <div>
                            <p style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.92rem" }}>Language</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Default display language</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>English (US)</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--border-color)" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <FiBell style={{ color: "var(--accent-color)" }} />
                          <div>
                            <p style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.92rem" }}>Notifications</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Email & In-App system alerts</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.9rem", color: "var(--accent-color)", fontWeight: "600" }}>Enabled</span>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <FiSettings style={{ color: "var(--accent-color)" }} />
                          <div>
                            <p style={{ fontWeight: "600", color: "var(--text-main)", fontSize: "0.92rem" }}>Dashboard Theme</p>
                            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Visual color profile</p>
                          </div>
                        </div>
                        <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "500" }}>Green ESG Theme</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSubTab === "security" && (
                  <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
                      Security & Session Control
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Authentication Mode</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)" }}>JWT Secured Session Tokens</p>
                      </div>

                      <div style={{ padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)" }}>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "4px" }}>Logged In Since</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: "600", color: "var(--text-main)" }}>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>

                    <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "20px", marginTop: "10px" }}>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                        Logout of your current browser session. This will clear local tokens immediately.
                      </p>
                      <button 
                        type="button" 
                        onClick={handleLogout} 
                        className="btn-danger" 
                        style={{ height: "42px", padding: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                      >
                        <FiLogOut /> Logout Session
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
