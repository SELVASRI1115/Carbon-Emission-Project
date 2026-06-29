import { useEffect, useState } from "react";
import { FiDownload, FiEye } from "react-icons/fi";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import reportService from "../../services/reportService";

function Reports() {

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    loadReports();

  }, []);

  const loadReports =
    async () => {

      try {

        const data =
          await reportService
            .getAllReports();

        setReports(data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  return (

    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F4F6F8"
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
            Reports
          </h2>

          <div
            style={{
              background: "white",
              marginTop: "20px",
              borderRadius: "12px",
              padding: "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            {

              loading ?

              (

                <h3>
                  Loading...
                </h3>

              )

              :

              (

                <table
                  style={{
                    width: "100%",
                    borderCollapse:
                      "collapse"
                  }}
                >

                  <thead>

                    <tr
                      style={{
                        background:
                          "#E8F5E9"
                      }}
                    >

                      <th style={{padding:"12px"}}>
                        Report Name
                      </th>

                      <th style={{padding:"12px"}}>
                        Report Type
                      </th>

                      <th style={{padding:"12px"}}>
                        Vendor
                      </th>

                      <th style={{padding:"12px"}}>
                        File Path
                      </th>

                      <th style={{padding:"12px"}}>
                        Generated Date
                      </th>

                      <th style={{padding:"12px", textAlign:"center"}}>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {

                      reports.map(
                        (report) => (

                          <tr
                            key={
                              report.reportId
                            }
                          >

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.reportName
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.reportType
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.vendor
                                  ?.companyName
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.filePath
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee"
                              }}
                            >
                              {
                                report.generatedDate
                              }
                            </td>

                            <td
                              style={{
                                padding:"12px",
                                borderBottom:
                                  "1px solid #eee",
                                textAlign:"center"
                              }}
                            >
                              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                                <a 
                                  href={`http://localhost:8080/api/reports/download/${report.reportId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#2E7D32" }}
                                  title="Download PDF"
                                >
                                  <FiDownload size={18} />
                                </a>
                                <a 
                                  href={`http://localhost:8080/api/reports/view/${report.reportId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: "#2E7D32" }}
                                  title="View PDF"
                                >
                                  <FiEye size={18} />
                                </a>
                              </div>
                            </td>

                          </tr>

                        )
                      )

                    }

                  </tbody>

                </table>

              )

            }

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;