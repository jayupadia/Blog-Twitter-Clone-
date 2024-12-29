const Blog = require('../models/Blog');
const User = require('../models/User');
const Comment = require('../models/Comment'); // Add this line

// Create a blog post
exports.createBlog = async (req, res) => {
    const { title, content } = req.body;
    try {
        const newBlog = new Blog({ title, content, author: req.user.userId });
        await newBlog.save();
        res.status(201).json({ message: 'Blog post created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Like a blog post
exports.likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog.likes.includes(req.user.userId)) {
            blog.likes.push(req.user.userId);
            await blog.save();
        }
        res.status(200).json({ message: 'Blog liked' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Comment on a blog post
exports.commentBlog = async (req, res) => {
    const { comment } = req.body;
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        const newComment = new Comment({
            content: comment,
            user: req.user.userId,
            blog: blog._id
        });
        await newComment.save();

        blog.comments.push(newComment._id);
        await blog.save();

        res.status(200).json({ message: 'Comment added' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reply to a comment
exports.replyComment = async (req, res) => {
    const { commentId, reply } = req.body;
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        const newReply = new Comment({
            content: reply,
            user: req.user.userId,
            blog: comment.blog
        });
        await newReply.save();

        comment.replies.push(newReply._id);
        await comment.save();

        res.status(200).json({ message: 'Reply added' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
