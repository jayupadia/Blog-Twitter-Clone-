import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';
import './style/Home.css';
import Navbar from '../components/Navbar'; // Import the Navbar

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    };
    fetchBlogs();
  }, []);

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
    <div id="background" className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-4 mt-16">
        {blogs.map(blog => (
          <BlogCard key={blog._id} blog={blog} />
        ))}
      </div>
    </div>
  );
};


export default Home;
