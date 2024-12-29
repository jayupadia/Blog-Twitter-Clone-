const User = require('../models/User');
const Blog = require('../models/Blog');

// Edit user profile
exports.editProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    }
};

// Create a new blog
exports.createBlog = async (req, res) => {
    try {
        const { content } = req.body;
        const blog = new Blog({ content, author: req.user.id });
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Error creating blog' });
    }
};

// Search profiles and blogs
exports.search = async (req, res) => {
    try {
        const query = req.query.q;
        const profiles = await User.find({ name: new RegExp(query, 'i') });
        const blogs = await Blog.find({ content: new RegExp(query, 'i') });
        res.json({ profiles, blogs });
    } catch (error) {
        res.status(500).json({ error: 'Error searching' });
    }
};

// View all blogs
exports.viewBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.status(200).json(blogs);
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

// Search blogs
exports.searchBlogs = async (req, res) => {
    const { query } = req.query;
    try {
        const blogs = await Blog.find({ 
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        }).populate('author', 'username');
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
