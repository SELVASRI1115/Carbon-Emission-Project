import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import {
  generateReport
} from "../../services/reportService";

import vendorService from "../../services/vendorService";

function GenerateReport() {

  const navigate =
    useNavigate();

  const [vendors,
    setVendors] =
    useState([]);

  const [formData,
    setFormData] =
    useState({

      reportName: "",

      reportType: "",

      filePath: "",

      vendorId: ""

    });

  useEffect(() => {

    loadVendors();

  }, []);

  const loadVendors =
  async () => {

    try {

      const data =
        await vendorService.getAllVendors();

      setVendors(data);

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

      await generateReport(
        formData
      );

      alert(
        "Report Generated Successfully"
      );

      navigate(
        "/admin/reports"
      );

    } catch (error) {

      console.log(error);

      alert(
        "Failed To Generate Report"
      );
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
              background:
                "white",
              padding:
                "30px",
              borderRadius:
                "10px",
              maxWidth:
                "700px"
            }}
          >

            <h2>
              Generate Report
            </h2>

            <form
              onSubmit={
                handleSubmit
              }
            >

              <input
                type="text"
                name="reportName"
                placeholder="Report Name"
                onChange={
                  handleChange
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <input
                type="text"
                name="reportType"
                placeholder="Report Type"
                onChange={
                  handleChange
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <input
                type="text"
                name="filePath"
                placeholder="File Path"
                onChange={
                  handleChange
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              />

              <select
                name="vendorId"
                onChange={
                  handleChange
                }
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  marginBottom:
                    "15px"
                }}
              >

                <option value="">
                  Select Vendor
                </option>

                {
                  vendors.map(
                    (vendor) => (

                    <option
                      key={
                        vendor.vendorId
                      }
                      value={
                        vendor.vendorId
                      }
                    >
                      {
                        vendor.companyName
                      }
                    </option>

                  ))
                }

              </select>

              <button
                type="submit"
                style={{
                  background:
                    "#2e7d32",
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
                Generate Report
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default GenerateReport;