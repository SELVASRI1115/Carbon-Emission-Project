import { useEffect, useState } from "react";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import userService from "../../services/userService";

function Profile() {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const [formData, setFormData] =
    useState({

      name: "",

      email: "",

      role: ""

    });

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser =
    async () => {

      try {

        const response =
          await userService
            .getUserById(
              user.id
            );

        const userData =
          response.value
          ? response.value
          : response;

        setFormData({

          name:
            userData.name || "",

          email:
            userData.email || "",

          role:
            userData.role || ""

        });

      } catch (error) {

        console.log(error);
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

        await userService
          .updateUser(
            user.id,
            formData
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
            My Profile
          </h2>

          <div
            style={{
              background:
                "white",
              marginTop:
                "20px",
              padding:
                "30px",
              borderRadius:
                "12px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
              maxWidth:
                "700px"
            }}
          >

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div
                style={{
                  marginBottom:
                    "20px"
                }}
              >

                <label>
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "12px",
                    marginTop:
                      "5px"
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
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={
                    formData.email
                  }
                  onChange={
                    handleChange
                  }
                  style={{
                    width:
                      "100%",
                    padding:
                      "12px",
                    marginTop:
                      "5px"
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
                    formData.role
                  }
                  disabled
                  style={{
                    width:
                      "100%",
                    padding:
                      "12px",
                    marginTop:
                      "5px",
                    background:
                      "#f5f5f5"
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
                    "12px 25px",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer"
                }}
              >
                Update Profile
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;