function Loader() {

  return (

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >

      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #ddd",
          borderTop:
            "5px solid #2E7D32",
          borderRadius: "50%",
          animation:
            "spin 1s linear infinite"
        }}
      />

    </div>
  );
}

export default Loader;