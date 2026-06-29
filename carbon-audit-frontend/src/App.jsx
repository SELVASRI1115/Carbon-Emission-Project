import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

/* Auth */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

/* Admin */
import AdminDashboard from "./pages/admin/Dashboard";
import Vendors from "./pages/admin/Vendors";
import Addvendors from "./pages/admin/Addvendors";
import Emissions from "./pages/admin/Emissions";
import AddEmission from "./pages/admin/AddEmission";
import Reports from "./pages/admin/Reports";
import GenerateReport from "./pages/admin/GenerateReport";
import Users from "./pages/admin/users";
import AdminProfile from "./pages/admin/Profile";
import AdminSettings from "./pages/admin/Settings";
import AddCategory from "./pages/admin/AddCategory";
import Analytics from "./pages/admin/Analytics";
import AuditVerification from "./pages/admin/AuditVerification";

/* Vendor */
import VendorDashboard from "./pages/vendor/Dashboard";
import SubmitEmission from "./pages/vendor/SubmitEmission";
import MyEmissions from "./pages/vendor/MyEmissions";
import VendorReports from "./pages/vendor/Reports";
import VendorProfile from "./pages/vendor/Profile";
import VendorSettings from "./pages/vendor/Settings";
import VendorAddEmission from "./pages/vendor/AddEmission";

/* Auditor */
import AuditorDashboard from "./pages/auditor/Dashboard";
import PendingAudits from "./pages/auditor/PendingAudits";
import ReviewAudit from "./pages/auditor/ReviewAudit";
import AuditHistory from "./pages/auditor/AuditHistory";
import AuditorSettings from "./pages/auditor/Settings";

/* Common */
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {

return (

<BrowserRouter>

<Routes>

{/* Default */}

<Route
path="/"
element={<Navigate to="/login"/>}
/>

{/* Authentication */}

<Route
path="/login"
element={<Login/>}
/>

<Route
path="/register"
element={<Register/>}
/>

{/* ADMIN */}

<Route
path="/admin/dashboard"
element={
<ProtectedRoute role="ADMIN">
<AdminDashboard/>
</ProtectedRoute>
}
/>

<Route
path="/admin/vendors"
element={
<ProtectedRoute role="ADMIN">
<Vendors/>
</ProtectedRoute>
}
/>

<Route
path="/admin/add-vendor"
element={
<ProtectedRoute role="ADMIN">
<Addvendors/>
</ProtectedRoute>
}
/>

<Route
path="/admin/emissions"
element={
<ProtectedRoute role="ADMIN">
<Emissions/>
</ProtectedRoute>
}
/>

<Route
path="/admin/add-emission"
element={
<ProtectedRoute role="ADMIN">
<AddEmission/>
</ProtectedRoute>
}
/>

<Route
path="/admin/reports"
element={
<ProtectedRoute role="ADMIN">
<Reports/>
</ProtectedRoute>
}
/>

<Route
path="/admin/generate-report"
element={
<ProtectedRoute role="ADMIN">
<GenerateReport/>
</ProtectedRoute>
}
/>

<Route
path="/admin/users"
element={
<ProtectedRoute role="ADMIN">
<Users/>
</ProtectedRoute>
}
/>

<Route
path="/admin/profile"
element={
<ProtectedRoute role="ADMIN">
<AdminProfile/>
</ProtectedRoute>
}
/>

<Route
path="/admin/settings"
element={
<ProtectedRoute role="ADMIN">
<AdminSettings/>
</ProtectedRoute>
}
/>
<Route
path="/admin/add-category"
element={<AddCategory/>}
/>

<Route
path="/admin/analytics"
element={
<ProtectedRoute role="ADMIN">
<Analytics/>
</ProtectedRoute>
}
/>

<Route
path="/admin/audit-verification"
element={
<ProtectedRoute role="ADMIN">
<AuditVerification/>
</ProtectedRoute>
}
/>

{/* VENDOR */}

<Route
path="/vendor/dashboard"
element={
<ProtectedRoute role="VENDOR">
<VendorDashboard/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/submit-emission"
element={
<ProtectedRoute role="VENDOR">
<SubmitEmission/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/my-emissions"
element={
<ProtectedRoute role="VENDOR">
<MyEmissions/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/reports"
element={
<ProtectedRoute role="VENDOR">
<VendorReports/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/add-emission"
element={
<ProtectedRoute role="VENDOR">
<SubmitEmission/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/profile"
element={
<ProtectedRoute role="VENDOR">
<VendorProfile/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/settings"
element={
<ProtectedRoute role="VENDOR">
<VendorSettings/>
</ProtectedRoute>
}
/>

<Route
path="/vendor/analytics"
element={
<ProtectedRoute role="VENDOR">
<Analytics/>
</ProtectedRoute>
}
/>

{/* AUDITOR */}

<Route
path="/auditor/dashboard"
element={
<ProtectedRoute role="AUDITOR">
<AuditorDashboard/>
</ProtectedRoute>
}
/>

<Route
path="/auditor/pending-audits"
element={
<ProtectedRoute role="AUDITOR">
<PendingAudits/>
</ProtectedRoute>
}
/>

<Route
path="/auditor/review-audit"
element={
<ProtectedRoute role="AUDITOR">
<ReviewAudit/>
</ProtectedRoute>
}
/>

<Route
path="/auditor/audit-history"
element={
<ProtectedRoute role="AUDITOR">
<AuditHistory/>
</ProtectedRoute>
}
/>

<Route
path="/auditor/settings"
element={
<ProtectedRoute role="AUDITOR">
<AuditorSettings/>
</ProtectedRoute>
}
/>

<Route
path="/auditor/analytics"
element={
<ProtectedRoute role="AUDITOR">
<Analytics/>
</ProtectedRoute>
}
/>

{/* Not Found */}

<Route
path="*"
element={
<h2
style={{
textAlign:"center",
marginTop:"50px"
}}
>
404 - Page Not Found
</h2>
}
/>

</Routes>

</BrowserRouter>

);

}

export default App;