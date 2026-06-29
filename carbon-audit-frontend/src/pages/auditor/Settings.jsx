import { useEffect, useState } from "react";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import userService from "../../services/userService";

function Settings() {

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [userData, setUserData] =
    useState({

      name: "",

      email: "",

      role: ""

    });

  useEffect(() => {

    if (currentUser) {

      loadUser();
    }

  }, []);

  const loadUser =
    async () => {

      try {

        const data =
          await userService
            .getUserById(
              currentUser.id
            );

        setUserData(data);

      } catch (error) {

        console.log(error);
      }
    };

  const handleChange =
    (e) => {

      setUserData({

        ...userData,

        [e.target.name]:
          e.target.value

      });
    };

  const handleUpdate =
    async (e) => {

      e.preventDefault();

      try {

        await userService
          .updateUser(
            currentUser.id,
            userData
          );

        alert(
          "Profile Updated Successfully"
        );

      } catch (error) {

        console.log(error);

        alert(
          "Update Failed"
        );
      }
    };

  const handleLogout =
    () => {

      localStorage.clear();

      window.location.href =
        "/";
    };

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#f4f6f9"
      }}
    >

      <Sidebar />

      <div
        style={{
          flex: 1
        }}
      >

        <Navbar />

        <div
          style={{
            padding: "25px"
          }}
        >

          <h2>
            Auditor Settings
          </h2>

          <div
            style={{
              background:
                "white",
              marginTop:
                "20px",
              padding:
                "25px",
              borderRadius:
                "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            <form
              onSubmit={
                handleUpdate
              }
            >

              <div
                style={{
                  marginBottom:
                    "15px"
                }}
              >

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    userData.name
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    marginTop:
                      "8px"
                  }}
                />

              </div>

              <div
                style={{
                  marginBottom:
                    "15px"
                }}
              >

                <label>
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    userData.email
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    marginTop:
                      "8px"
                  }}
                />

              </div>

              <div
                style={{
                  marginBottom:
                    "20px"
                }}
              >

                <label>
                  Role
                </label>

                <input
                  type="text"
                  value={
                    userData.role
                  }
                  readOnly
                  style={{
                    width:
                      "100%",
                    padding:
                      "10px",
                    marginTop:
                      "8px",
                    background:
                      "#eeeeee"
                  }}
                />

              </div>

              <button
                type="submit"
                style={{
                  background:
                    "#2E7D32",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "12px 20px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer"
                }}
              >
                Update Profile
              </button>

              <button
                type="button"
                onClick={
                  handleLogout
                }
                style={{
                  background:
                    "#D32F2F",
                  color:
                    "white",
                  border:
                    "none",
                  padding:
                    "12px 20px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  marginLeft:
                    "15px"
                }}
              >
                Logout
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;