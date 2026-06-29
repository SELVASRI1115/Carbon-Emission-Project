import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";

import categoryService from "../../services/categoryService";
import emissionService from "../../services/emissionService";

function AddEmission() {

const navigate = useNavigate();

const user =
JSON.parse(
localStorage.getItem("user")
);

const [categories,setCategories] =
useState([]);

const [formData,setFormData] =
useState({

vendorId:
user?.vendorId || "",

categoryId:"",

activityData:"",

emissionFactor:0,

reportingMonth:"",

status:"PENDING"

});

useEffect(()=>{

loadCategories();

},[]);

const loadCategories =
async()=>{

try{

const data =
await categoryService
.getAllCategories();

setCategories(
data || []
);

}

catch(error){

console.log(error);

}

};

const factorMap={

Transportation:0.21,

Electricity:0.82,

Fuel:2.68,

Waste:0.45,

Manufacturing:1.45,

Travel:0.18

};

const handleCategoryChange =
(e)=>{

const categoryId =
e.target.value;

const category =
categories.find(

item =>

item.categoryId == categoryId

);

const factor =

factorMap[
category?.categoryName
]

|| 0.5;

setFormData({

...formData,

categoryId,

emissionFactor:
factor

});

};

const handleChange =
(e)=>{

setFormData({

...formData,

[e.target.name]: e.target.value

});

};

const total =

(Number(
formData.activityData
) || 0)

*

(Number(
formData.emissionFactor
) || 0);

const handleSubmit =
async(e)=>{

e.preventDefault();

try{

await emissionService
.addEmission(

formData

);

alert(
"Emission Added Successfully"
);

navigate(
"/vendor/my-emissions"
);

}

catch(error){

console.log(error);

alert(
"Failed To Save Emission"
);

}

};

return(

<div
style={{
display:"flex",
minHeight:"100vh",
background:"#F4F6F8"
}}
>

<Sidebar/>

<div style={{flex:1}}>

<Navbar/>

<div
style={{
padding:"30px"
}}
>

<div
style={{
maxWidth:"850px",
margin:"auto",
background:"white",
padding:"35px",
borderRadius:"20px",
boxShadow:
"0 5px 20px rgba(0,0,0,0.1)"
}}
>

<h1
style={{
color:"#2E7D32",
marginBottom:"30px",
textAlign:"center"
}}
>

Add Carbon Emission

</h1>

<form
onSubmit={
handleSubmit
}
>

<label>
Category
</label>

<select
value={
formData.categoryId
}
onChange={
handleCategoryChange
}
required
style={{
width:"100%",
padding:"14px",
marginBottom:"20px",
borderRadius:"10px"
}}

>

<option value="">
Select Category
</option>

{

categories.map(
(item)=>(

<option
key={
item.categoryId
}
value={
item.categoryId
}
>

{
item.categoryName
}

</option>

))

}

</select>

<label>
Activity Quantity
</label>

<input
type="number"
name="activityData"
placeholder="Example : 150 km"
value={
formData.activityData
}
onChange={
handleChange
}
required
min="1"
style={{
width:"100%",
padding:"14px",
marginBottom:"20px",
borderRadius:"10px"
}}
/>

<label>
Emission Factor
</label>

<input
value={
formData.emissionFactor
}
readOnly
style={{
width:"100%",
padding:"14px",
marginBottom:"20px",
borderRadius:"10px",
background:"#eee"
}}
/>

<label>
Reporting Month
</label>

<input
type="month"
name="reportingMonth"
value={
formData.reportingMonth
}
onChange={
handleChange
}
required
style={{
width:"100%",
padding:"14px",
marginBottom:"20px",
borderRadius:"10px"
}}
/>

<div
style={{
background:"#E8F5E9",
padding:"20px",
borderRadius:"12px",
marginBottom:"25px"
}}
>

<h2>

Estimated CO₂:

{" "}
{total.toFixed(2)}

kg

</h2>

</div>

<button
type="submit"
style={{
width:"100%",
padding:"15px",
background:"#2E7D32",
color:"white",
border:"none",
borderRadius:"10px",
fontSize:"18px",
cursor:"pointer"
}}

>

Save Emission

</button>

</form>

</div>

</div>

</div>

</div>

);

}

export default AddEmission;
