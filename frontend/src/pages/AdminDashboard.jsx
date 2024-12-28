import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchStats, fetchLikes, fetchComments, toggleAdminBlock, deleteComment, logoutAdmin } from '../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsData = await fetchStats(token);
                console.log("Stats data:", statsData); // Add console log
                setStats(statsData);

                const likesData = await fetchLikes(token);
                console.log("Likes data:", likesData); // Add console log
                setLikes(likesData);

                const commentsData = await fetchComments(token);
                console.log("Comments data:", commentsData); // Add console log
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [token]);

    const handleBlockAdmin = async (adminId, block) => {
        try {
            await toggleAdminBlock(token, adminId, block);
            // Optionally, refresh data or provide feedback to the user
        } catch (error) {
            console.error('Error blocking/unblocking admin:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(token, commentId);
            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutAdmin(token);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            navigate('/login');
            console.log('Logout successful');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            {stats ? (
                <div className="space-y-4">
                    <p>Total Users: {stats.userCount}</p>
                    <p>Active Users: {stats.activeUsers}</p>
                    <p>Total Blogs: {stats.blogCount}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            {/* Display likes */}
            <h2 className="text-2xl mt-6">Likes</h2>
            <ul>
                {likes && likes.length > 0 && likes.map((like, index) => (
                    <li key={index}>
                        Blog {like.blogId}: {like.likes} likes
                    </li>
                ))}
            </ul>

            {/* Display comments */}
            <h2 className="text-2xl mt-6">Comments</h2>
            <ul>
                {comments && comments.length > 0 && comments.map((comment, index) => (
                    <li key={index}>
                        {comment.user.name}: {comment.content}
                        <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="ml-2 text-red-500"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            {/* Admin actions */}
            <h2 className="text-2xl mt-6">Admin Actions</h2>
            <button onClick={() => handleBlockAdmin('adminIdHere', true)} className="text-red-500">
                Block Admin
            </button>
            <button onClick={() => handleBlockAdmin('adminIdHere', false)} className="text-green-500">
                Unblock Admin
            </button>
            <button onClick={handleLogout} className="text-blue-500">
                Logout
            </button>
        </div>
    );
};

export default AdminDashboard;
