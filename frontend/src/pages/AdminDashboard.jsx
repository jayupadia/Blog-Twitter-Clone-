import { useEffect, useState } from 'react';
import {
    fetchStats,
    fetchLikes,
    fetchComments,
    toggleAdminBlock,
    deleteBlog,
    deleteComment,
} from '../services/api'; // Import the API functions

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [adminMessage, setAdminMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch statistics, likes, and comments
        const fetchData = async () => {
            try {
                const statsData = await fetchStats(token);
                const likesData = await fetchLikes(token);
                const commentsData = await fetchComments(token);

                setStats(statsData);
                setLikes(likesData);
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleBlockAdmin = async (adminId, block) => {
        const token = localStorage.getItem('token');
        try {
            await toggleAdminBlock(token, adminId, block);
            setAdminMessage(block ? 'Admin blocked successfully' : 'Admin unblocked successfully');
        } catch (error) {
            console.error('Error toggling admin block:', error);
        }
    };

    const handleDeleteBlog = async (blogId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteBlog(token, blogId);
            setAdminMessage('Blog deleted successfully');
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const token = localStorage.getItem('token');
        try {
            await deleteComment(token, commentId);
            setAdminMessage('Comment deleted successfully');
        } catch (error) {
            console.error('Error deleting comment:', error);
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
                {likes.map((like, index) => (
                    <li key={index}>
                        Blog {like.blogId}: {like.likes} likes
                    </li>
                ))}
            </ul>

            {/* Display comments */}
            <h2 className="text-2xl mt-6">Comments</h2>
            <ul>
                {comments.map((comment, index) => (
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
        </div>
    );
};

export default AdminDashboard;
