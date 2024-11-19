const User = require('../models/User');
const Blog = require('../models/Blog');
const Comment = require('../models/Comment'); // Assuming you have a Comment model

// Get all likes (assuming each blog has a likes array)
exports.getLikes = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('likes'); // Assuming likes is an array of user IDs
        const likes = blogs.map(blog => ({
            blogId: blog._id,
            likes: blog.likes.length,
            usersWhoLiked: blog.likes
        }));

        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching likes', error: error.message });
    }
};

// Get all comments (with users who commented)
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find().populate('user'); // Assuming comments have a user reference
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

// Block/Unblock an admin
exports.toggleAdminBlock = async (req, res) => {
    const { adminId, block } = req.body; // block will be true or false

    try {
        const admin = await User.findById(adminId);
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        admin.isBlocked = block;
        await admin.save();

        res.status(200).json({ message: `Admin ${block ? 'blocked' : 'unblocked'} successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking/unblocking admin', error: error.message });
    }
};

// Delete a harmful blog
exports.deleteBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        await blog.remove();
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting blog', error: error.message });
    }
};

// Delete a harmful comment
exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        await comment.remove();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};
