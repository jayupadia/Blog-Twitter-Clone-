import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchStats,
  fetchLikes,
  fetchComments,
  toggleAdminBlock,
  deleteComment,
  logoutAdmin,
} from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await fetchStats(token);
        setStats(statsData);

        const likesData = await fetchLikes(token);
        setLikes(likesData);

        const commentsData = await fetchComments(token);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleBlockAdmin = async (adminId, block) => {
    try {
      await toggleAdminBlock(token, adminId, block);
    } catch (error) {
      console.error("Error blocking/unblocking admin:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(token, commentId);
      setComments(comments.filter((comment) => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin(token);
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 min-h-screen bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Dashboard</h1>
        <nav className="space-y-4">
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
            Home
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
            Statistics
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
            Likes
          </button>
          <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700">
            Comments
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 bg-red-500 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="w-3/4 bg-gray-100 p-6 min-h-screen">
        {stats ? (
          <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Statistics</h2>
            <p className="text-lg">
              Total Users: <span className="font-semibold">{stats.userCount}</span>
            </p>
            <p className="text-lg">
              Active Users: <span className="font-semibold">{stats.activeUsers}</span>
            </p>
            <p className="text-lg">
              Total Blogs: <span className="font-semibold">{stats.blogCount}</span>
            </p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {/* Likes Section */}
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">Likes</h2>
        <ul className="bg-white p-6 rounded-lg shadow-md space-y-2">
          {likes.length > 0 &&
            likes.map((like, index) => (
              <li key={index} className="text-lg">
                Blog {like.blogId}: <span className="font-semibold">{like.likes} likes</span>
              </li>
            ))}
        </ul>

        {/* Comments Section */}
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">Comments</h2>
        <ul className="bg-white p-6 rounded-lg shadow-md space-y-2">
          {comments.length > 0 &&
            comments.map((comment, index) => (
              <li key={index} className="flex justify-between items-center">
                <span className="text-lg">
                  {comment.user.name}: {comment.content}
                </span>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>

        {/* Admin Actions */}
        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-700">Admin Actions</h2>
        <div className="space-x-4">
          <button
            onClick={() => handleBlockAdmin("adminIdHere", true)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Block Admin
          </button>
          <button
            onClick={() => handleBlockAdmin("adminIdHere", false)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Unblock Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
