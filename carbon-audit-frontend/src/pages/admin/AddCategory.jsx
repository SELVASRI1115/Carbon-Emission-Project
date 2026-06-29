import { useState } from "react";

import categoryService from "../../services/categoryService";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

function AddCategory() {

const [categoryName, setCategoryName] =
useState("");

const [loading, setLoading] =
useState(false);

const [toast, setToast] = useState({ show: false, message: "", type: "success" });

const showToast = (message, type = "success") => {
  setToast({ show: true, message, type });
  setTimeout(() => {
    setToast({ show: false, message: "", type: "success" });
  }, 4000);
};

const handleSubmit =
async(e)=>{

e.preventDefault();

try{

setLoading(true);

const data={

categoryName:
categoryName

};

console.log(
"Sending:",
data
);

await categoryService
.addCategory(data);

showToast("Category Added Successfully!", "success");

setCategoryName("");

}
catch(error){

console.log(
"Category Error:",
error
);

const errMsg = error.response?.data?.message || error.response?.data || "Failed to add category";
showToast(errMsg, "error");

}
finally{

setLoading(false);

}

};

return(

<div
style={{
display:"flex",
minHeight:"100vh",
background:"#f5f6fa"
}}
>

<Sidebar role="ADMIN"/>

<div style={{flex:1}}>

<Navbar/>

<div
style={{
padding:"30px"
}}
>

<div
style={{
background:"white",
padding:"30px",
maxWidth:"600px",
margin:"auto",
borderRadius:"12px",
boxShadow:
"0 2px 10px rgba(0,0,0,0.1)"
}}
>

<h2
style={{
textAlign:"center",
marginBottom:"30px"
}}
>
Add Category
</h2>

<form
onSubmit={handleSubmit}
>

<label
style={{
display:"block",
marginBottom:"10px",
fontWeight:"bold"
}}
>

Category Name

</label>

<input
type="text"
placeholder="Enter category"

value={categoryName}

onChange={(e)=>
setCategoryName(
e.target.value
)
}

required

style={{
width:"100%",
padding:"12px",
marginBottom:"20px",
border:"1px solid #ccc",
borderRadius:"8px",
fontSize:"15px"
}}
/>

<button
type="submit"

disabled={loading}

style={{
width:"100%",
background:"#2E7D32",
color:"white",
border:"none",
padding:"14px",
borderRadius:"8px",
fontSize:"16px",
cursor:"pointer"
}}
>

{
loading
?
"Saving..."
:
"Save Category"
}

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

export default AddCategory;