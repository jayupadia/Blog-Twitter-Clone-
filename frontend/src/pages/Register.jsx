import { useState, useEffect } from 'react';
import { registerUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import image from '../assets/pngegg.png';
import './style/Register.css';
import Navbar from '../components/Navbar'; // Import the Navbar


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      setMessage(data.message);
      navigate('/verify-otp', { state: { email } });
    } catch (error) {
      setMessage('Registration failed');
      console.error('Registration error:', error.response ? error.response.data : error.message);
    }
  };

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
            <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
              Register
            </button>
            {message && <p className="mt-4 text-red-500">{message}</p>}
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
    </div>
  );
};

export default Register;
