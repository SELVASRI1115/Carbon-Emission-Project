import { useEffect, useState } from "react";
import { FiUser, FiMail, FiShield, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import userService from "../../services/userService";

function Settings() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      const data = await userService.getUserById(currentUser.id);
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
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>Account Settings</h2>

          {loading ? (
            <Loader />
          ) : (
            <div className="premium-card" style={{ maxWidth: "600px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "24px" }}>
                Update Account Information
              </h3>

              <form onSubmit={saveChanges} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                
                {/* Name */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Full Name</label>
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
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Email Address</label>
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
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Access Role (Read-Only)</label>
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

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                  <button type="submit" className="btn-primary" style={{ height: "42px", padding: "0 24px" }}>
                    Save Changes
                  </button>

                  <button 
                    type="button" 
                    onClick={handleLogout} 
                    className="btn-danger" 
                    style={{ height: "42px", padding: "0 24px", display: "inline-flex", alignItems: "center", gap: "8px" }}
                  >
                    <FiLogOut /> Logout Session
                  </button>
                </div>

              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;