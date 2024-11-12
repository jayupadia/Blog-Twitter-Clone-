const User = require('../models/User');
const Blog = require('../models/Blog');

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new admin
exports.createAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const newAdmin = new User({ email, password, role: 'admin', isVerified: true });
        await newAdmin.save();

        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get website stats (number of users and blogs)
exports.getStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const blogCount = await Blog.countDocuments();
        const activeUsers = await User.find({ isActive: true }).countDocuments();

        res.status(200).json({ userCount, blogCount, activeUsers });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
