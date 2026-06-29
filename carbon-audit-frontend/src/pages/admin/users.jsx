import { useEffect, useState } from "react";
import { FiSearch, FiTrash2, FiUsers } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Loader from "../../components/common/Loader";
import { getAllUsers, deleteUser } from "../../services/userService";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.log(error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user account?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.role !== "ADMIN" && (
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const nonAdminCount = users.filter(u => u.role !== "ADMIN").length;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "30px", flex: 1 }} className="animate-fade-in">
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem", fontWeight: "700" }}>User Management</h2>
              <p style={{ marginTop: "4px" }}>View and configure access roles for all system users.</p>
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "10px",
              backgroundColor: "var(--accent-light)",
              color: "var(--accent-color)",
              fontWeight: "600",
              fontSize: "0.9rem"
            }}>
              <FiUsers />
              {nonAdminCount} Active User{nonAdminCount !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Search box */}
          <div style={{ position: "relative", width: "300px", marginBottom: "20px" }}>
            <FiSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="Search User..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ paddingLeft: "36px", height: "40px" }}
            />
          </div>

          {/* Table without ID column */}
          <div className="table-container">
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center" }}><Loader /></div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
                No users found.
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Access Role</th>
                    <th style={{ textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          backgroundColor: "var(--bg-app)",
                          border: "1px solid var(--border-color)"
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn-danger"
                          style={{
                            padding: "6px 12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "0.85rem"
                          }}
                        >
                          <FiTrash2 size={13} /> Delete Account
                        </button>
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

export default Users;