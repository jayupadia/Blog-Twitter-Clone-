import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard"; // Import UserDashboard
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "./components/Navbar";

// Create a Context for Auth
export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  // Watch for changes in localStorage and update `isAuthenticated`
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    console.log("isAuthenticated:", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <NavbarWithConditionalRender />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

const NavbarWithConditionalRender = () => {
  const location = useLocation();

  const shouldShowNavbar = ["/", "/login", "/signup"].includes(location.pathname);

  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location.pathname]);

  return shouldShowNavbar ? <Navbar /> : null;
};

export default App;
