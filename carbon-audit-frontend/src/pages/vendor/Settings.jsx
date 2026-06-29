import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import userService from "../../services/userService";

function Settings() {

  const navigate =
    useNavigate();

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [user, setUser] =
    useState({});

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser =
    async () => {

      try {

        const response =
          await userService
            .getUserById(
              currentUser.id
            );

        const userData =
          response.value
          ? response.value
          : response;

        setUser(userData);

      } catch (error) {

        console.log(error);
      }
    };

  const handleLogout =
    () => {

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      navigate("/login");
    };

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background:
          "#F4F6F8"
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
            Settings
          </h2>

          <div
            style={{
              marginTop: "20px",
              display: "grid",
              gap: "20px"
            }}
          >

            <div
              style={{
                background:
                  "white",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)"
              }}
            >

              <h3>
                Account Information
              </h3>

              <hr />

              <p>
                <strong>
                  Name:
                </strong>{" "}
                {user.name}
              </p>

              <p>
                <strong>
                  Email:
                </strong>{" "}
                {user.email}
              </p>

              <p>
                <strong>
                  Role:
                </strong>{" "}
                {user.role}
              </p>

            </div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)"
              }}
            >

              <h3>
                System Preferences
              </h3>

              <hr />

              <p>
                Dashboard Theme :
                Green ESG Theme
              </p>

              <p>
                Notifications :
                Enabled
              </p>

              <p>
                Language :
                English
              </p>

            </div>

            <div
              style={{
                background:
                  "white",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                boxShadow:
                  "0 2px 10px rgba(0,0,0,0.08)"
              }}
            >

              <h3>
                Account Actions
              </h3>

              <hr />

              <button
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
                    "12px 25px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  marginTop:
                    "10px"
                }}
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Settings;