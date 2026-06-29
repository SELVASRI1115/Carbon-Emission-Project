import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { addVendor } from "../../services/vendorService";
import userService from "../../services/userService";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function Addvendors() {

const navigate = useNavigate();

const [users, setUsers] =
useState([]);

const [toast, setToast] = useState({ show: false, message: "", type: "success" });

const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: "", type: "success" });
  }, 4000);
};

const [formData, setFormData] =
useState({

  companyName: "",
  industry: "",
  address: "",
  status: "ACTIVE",
  companyType: "CUSTOMER",
  userId: ""

});


useEffect(() => {


loadUsers();


}, []);

const loadUsers = async () => {

try {

  const response =
    await userService.getAllUsers();

  console.log(
    "Users:",
    response
  );

  setUsers(
    Array.isArray(response)
      ? response
      : []
  );

} catch (error) {

  console.log(
    "User Loading Error:",
    error
  );

  setUsers([]);

}

};

const handleChange =
(e) => {

  setFormData({

    ...formData,

    [e.target.name]:
      e.target.value

  });

};


const handleSubmit =
async (e) => {

  e.preventDefault();

  try {

    await addVendor(
      formData
    );

    showToast("Company Added Successfully!", "success");

    setTimeout(() => {
      navigate(
        "/admin/vendors"
      );
    }, 1500);

  } catch (error) {

    console.log(error);
    const errMsg = error.response?.data?.message || error.response?.data || "Failed To Add Company";
    showToast(errMsg, "error");

  }
};


return (

<div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "#f5f6fa"
  }}
>

  <Sidebar role="ADMIN" />

  <div style={{ flex: 1 }}>

    <Navbar />

    <div
      style={{
        padding: "30px"
      }}
    >

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "10px",
          maxWidth: "700px"
        }}
      >

        <h2>
          Add Company
        </h2>

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            onChange={handleChange}
            required
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px"
            }}
          />

          <input
            type="text"
            name="industry"
            placeholder="Industry"
            onChange={handleChange}
            required
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px"
            }}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            onChange={handleChange}
            required
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px"
            }}
          />

          <select
            name="status"
            onChange={handleChange}
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px"
            }}
          >

            <option value="ACTIVE">
              ACTIVE
            </option>

            <option value="INACTIVE">
              INACTIVE
            </option>

          </select>

          <select
            name="companyType"
            onChange={handleChange}
            required
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"15px"
            }}
          >
            <option value="CUSTOMER">CUSTOMER (Buyer)</option>
            <option value="SUPPLIER">SUPPLIER</option>
          </select>

          <select
            name="userId"
            onChange={handleChange}
            required
            style={{
              width:"100%",
              padding:"12px",
              marginBottom:"20px"
            }}
          >

            <option value="">
              Select User
            </option>

            {
              users?.map(
                (user) => (

                  <option
                    key={
                      user.userId || user.id
                    }
                    value={
                      user.userId || user.id
                    }
                  >

                    {user.name}
                    {" - "}
                    {user.role}

                  </option>

                )
              )
            }

          </select>

          <button
            type="submit"
            style={{
              background:"#2e7d32",
              color:"white",
              border:"none",
              padding:"12px 20px",
              borderRadius:"8px",
              cursor:"pointer"
            }}
          >

            Save Company

          </button>

        </form>

      </div>

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

export default Addvendors;
