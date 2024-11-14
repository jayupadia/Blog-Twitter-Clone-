import { useState, useEffect } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import image from '../assets/pngegg.png';
import './style/Register.css';
import Navbar from '../components/Navbar'; // Import the Navbar
import { Circles } from 'react-loader-spinner'; // Import a loader spinner

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true before submitting

    try {
      const data = await registerUser(name, email, password);
      setMessage(data.message);
      setLoading(false); // Reset loading state after success
      navigate('/verify-otp', { state: { email, name, password } });
    } catch (error) {
      setLoading(false); // Reset loading state on error

      // Check if the error response is available and has a message
      const errorMessage = error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Registration failed';

      setMessage(errorMessage);
      console.error('Registration error:', errorMessage);
    }
  };

  // UseEffect to handle hiding the popup after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // Hide the popup after 5 seconds
      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [message]);

  const handleMouseMove = (e) => {
    const background = document.getElementById('background');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    background.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #333, #222, #111)`;
  };

  useEffect(() => {
    document.getElementById('background').addEventListener('mousemove', handleMouseMove);
    return () => document.getElementById('background').removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div id="background" className="flex items-center justify-center min-h-screen relative overflow-hidden">
      <Navbar />
      <div className="relative flex w-full max-w-3xl p-8 bg-black bg-opacity-90 rounded-lg shadow-lg">
        <div className="rotating-border"></div>
        <div className="w-2/3 pr-8">
          <h2 className="text-3xl font-bold text-white mb-6">Register</h2>
          <form onSubmit={handleSubmit} className="mt-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="custom-input mb-4"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-input mb-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="custom-input mb-4"
              required
            />
            <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded" disabled={loading}>
              {loading ? 'Registering...' : 'Register'} {/* Show "Registering..." when loading */}
            </button>
            {loading && (
              <div className="flex justify-center mt-4">
                <Circles height="30" width="30" color="#4fa94d" ariaLabel="loading" />
              </div>
            )}
          </form>
        </div>
        <div className="w-1/3">
          <img
            src={image} // Replace with your image URL
            alt="Side Visual"
            className="w-full h-full object-cover rounded-lg twitter"
          />
        </div>
      </div>

      {/* Popup message */}
      {message && (
        <div className={`popup-message ${message.includes('failed') ? 'error' : 'success'} show`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Register;
