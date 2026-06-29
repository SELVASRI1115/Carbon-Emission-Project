import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function BarChart({
  dashboardData
}) {

  const data = [

    {
      name: "Users",
      value: dashboardData?.totalUsers || 0
    },

    {
      name: "Vendors",
      value: dashboardData?.totalVendors || 0
    },

    {
      name: "Reports",
      value: dashboardData?.totalReports || 0
    },

    {
      name: "Emissions",
      value: dashboardData?.totalEmissions || 0
    }

  ];

  return (

    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "12px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,0.1)"
      }}
    >

      <h3>System Statistics</h3>

      <ResponsiveContainer
        width="100%"
        height={300}
      >

        <RechartsBarChart
          data={data}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="name"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#2E7D32"
          />

        </RechartsBarChart>

      </ResponsiveContainer>

    </div>
  );
}

export default BarChart;