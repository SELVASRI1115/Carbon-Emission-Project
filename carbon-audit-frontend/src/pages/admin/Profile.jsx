import { useEffect, useState } from "react";
import { FiUser, FiMail, FiShield, FiCpu, FiCheck } from "react-icons/fi";

import Navbar from "../../components/common/Navbar";
import Sidebar from "../../components/common/Sidebar";
import userService from "../../services/userService";
import Loader from "../../components/common/Loader";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [userData, setUserData] = useState({
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
      setUserData({
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
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(currentUser.id, userData);
      
      // Update local storage so headers reflect the change immediately
      const updatedUser = { ...currentUser, name: userData.name, email: userData.email };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      alert("Profile Updated Successfully");
      window.location.reload(); // Refresh the page to reload state
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          <h2 style={{ fontSize: "1.8rem", fontWeight: "700", marginBottom: "24px" }}>My Profile</h2>

          {loading ? (
            <Loader />
          ) : (
            <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
              
              {/* Profile Card Summary */}
              <div className="premium-card" style={{ width: "320px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "30px", textAlign: "center" }}>
                <div style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent-light)",
                  border: "2px solid var(--accent-color)",
                  color: "var(--accent-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.4rem",
                  fontWeight: "800"
                }}>
                  {userData.name ? userData.name[0].toUpperCase() : "A"}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>{userData.name}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>{userData.role}</p>
                </div>
              </div>

              {/* Editable Info Panel */}
              <div className="premium-card" style={{ flex: 1, minWidth: "350px" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "700", borderBottom: "1px solid var(--border-color)", paddingBottom: "12px", marginBottom: "24px" }}>
                  Account Information
                </h3>

                <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Full Name</label>
                    <div style={{ position: "relative" }}>
                      <FiUser style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        style={{ paddingLeft: "42px", height: "42px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-main)" }}>Email Address</label>
                    <div style={{ position: "relative" }}>
                      <FiMail style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        style={{ paddingLeft: "42px", height: "42px" }}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-muted)" }}>Access Role (Read-Only)</label>
                    <div style={{ position: "relative" }}>
                      <FiShield style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        type="text"
                        value={userData.role}
                        readOnly
                        className="form-input"
                        style={{ paddingLeft: "42px", height: "42px", backgroundColor: "var(--bg-app)", color: "var(--text-muted)", cursor: "not-allowed" }}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ padding: "12px 24px", alignSelf: "flex-start", marginTop: "10px" }}>
                    <FiCheck /> Update Profile
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;