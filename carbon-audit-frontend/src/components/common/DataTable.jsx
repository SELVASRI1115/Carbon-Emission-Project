function DataTable({
  columns,
  data
}) {

  return (

    <table
      style={{
        width: "100%",
        borderCollapse:
          "collapse",
        backgroundColor:
          "white"
      }}
    >

      <thead>

        <tr>

          {
            columns.map(
              (col,index) => (

              <th
                key={index}
                style={{
                  border:
                    "1px solid #ddd",
                  padding:
                    "10px"
                }}
              >
                {col}
              </th>

            ))
          }

        </tr>

      </thead>

      <tbody>

        {
          data.map(
            (row,index)=>(

            <tr key={index}>

              {
                Object.values(row)
                .map(
                  (value,i)=>(

                  <td
                    key={i}
                    style={{
                      border:
                        "1px solid #ddd",
                      padding:
                        "10px"
                    }}
                  >
                    {String(value)}
                  </td>

                ))
              }

            </tr>

          ))
        }

      </tbody>

    </table>
  );
}

export default DataTable;