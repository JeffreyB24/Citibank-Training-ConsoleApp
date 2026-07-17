import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    const correctDashboard =
      role === "ADMIN" ? "/admin" : "/customer";

    return <Navigate to={correctDashboard} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;