import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Fetch statistics from the backend
    const fetchStats = async () => {
      const token = localStorage.getItem('token'); // Admin token
      const response = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {stats ? (
        <div className="space-y-4">
          <p>Total Users: {stats.totalUsers}</p>
          <p>Active Users: {stats.activeUsers}</p>
          <p>Total Blogs: {stats.totalBlogs}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AdminDashboard;
