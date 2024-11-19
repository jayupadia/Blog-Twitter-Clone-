import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import Navbar from "../components/Navbar";
import "./style/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      setMessage("Login successful");
      setShowMessage(true);

      // Check the role and navigate accordingly

      if (data.role === "admin") {
        navigate("/admin-dashboard"); // Redirect to admin dashboard
      } else {
        navigate("/user-dashboard"); // Redirect to user dashboard
      }
    } catch (error) {
      setMessage("Login failed: " + error.message);
      setShowMessage(true);
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 5000);
  };

  const handleMouseMove = (e) => {
    const background = document.getElementById("background");
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    background.style.background = `radial-gradient(circle at ${x * 100}% ${
      y * 100
    }%, #333, #222, #111)`;
  };

  useEffect(() => {
    document
      .getElementById("background")
      .addEventListener("mousemove", handleMouseMove);
    return () =>
      document
        .getElementById("background")
        .removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      id="background"
      className="flex items-center justify-center min-h-screen relative overflow-hidden"
    >
      <Navbar />
      <div className="login-container rounded-lg shadow-lg p-8 text-white bg-opacity-80 bg-gray-900">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-input w-full p-3 rounded-lg bg-gray-800 text-white border border-blue-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="custom-input w-full p-3 rounded-lg bg-gray-800 text-white border border-blue-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-200 text-white font-bold"
          >
            Login
          </button>
        </form>
        {showMessage && <div className="bubble-message">{message}</div>}
      </div>
    </div>
  );
};

export default Login;
