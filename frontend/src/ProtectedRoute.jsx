import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  console.log("userRole", userRole);
  console.log("role", role);
  
  // If there's no token, or if the user does not have the required role, redirect to login
  if (!token || (role && userRole !== role)) {
    return <Navigate to="/login" />;
  }

  return children; // If the user is authorized, render the protected content
};

export default ProtectedRoute;
