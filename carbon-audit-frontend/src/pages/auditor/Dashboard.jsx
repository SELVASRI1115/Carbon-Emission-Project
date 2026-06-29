import { useEffect, useState } from "react";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import DashboardCard from "../../components/common/DashboardCard";

import auditService from "../../services/auditService";
import dashboardService from "../../services/dashboardService";

function Dashboard() {

  const [summary, setSummary] =
    useState({});

  const [audits, setAudits] =
    useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      try {

        const dashboardData =
          await dashboardService
            .getDashboardSummary();

        const auditData =
          await auditService
            .getPendingRecords();

        setSummary(
          dashboardData
        );

        setAudits(
          auditData
        );

      } catch (error) {

        console.log(error);
      }
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
            Auditor Dashboard
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
              marginTop: "20px"
            }}
          >

            <DashboardCard
              title="Pending Audits"
              value={
                summary.pendingAudits
              }
            />

            <DashboardCard
              title="Approved Audits"
              value={
                summary.approvedAudits
              }
            />

            <DashboardCard
              title="Rejected Audits"
              value={
                summary.rejectedAudits
              }
            />

            <DashboardCard
              title="Total Emissions"
              value={
                summary.totalEmissions
              }
            />

          </div>

          <div
            style={{
              background:
                "white",
              marginTop:
                "30px",
              borderRadius:
                "12px",
              padding:
                "20px",
              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >

            <h3>
              Recent Pending Audits
            </h3>

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                marginTop:
                  "15px"
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#e8f5e9"
                  }}
                >

                  <th
                    style={{
                      padding:
                        "12px"
                    }}
                  >
                    Vendor
                  </th>

                  <th
                    style={{
                      padding:
                        "12px"
                    }}
                  >
                    Category
                  </th>

                  <th
                    style={{
                      padding:
                        "12px"
                    }}
                  >
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  audits
                    .slice(0, 5)
                    .map(
                      (
                        audit
                      ) => (

                        <tr
                          key={
                            audit.auditId
                          }
                        >

                          <td
                            style={{
                              padding:
                                "12px",
                              borderBottom:
                                "1px solid #eee"
                            }}
                          >
                            {
                              audit.emission
                                ?.vendor
                                ?.companyName
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              borderBottom:
                                "1px solid #eee"
                            }}
                          >
                            {
                              audit.emission
                                ?.category
                                ?.categoryName
                            }
                          </td>

                          <td
                            style={{
                              padding:
                                "12px",
                              borderBottom:
                                "1px solid #eee"
                            }}
                          >
                            {
                              audit.action
                            }
                          </td>

                        </tr>

                      )
                    )

                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;