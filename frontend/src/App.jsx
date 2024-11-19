import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp'; // Adjust the path if needed
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './components/Navbar';


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/Signup" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} /> {/* Add this line */}
        {/* Protect the admin dashboard */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
