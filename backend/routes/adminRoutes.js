const express = require('express');
const User = require('../models/User'); // Assuming you have a User model
const Blog = require('../models/Blog'); // Assuming you have a Blog model
const router = express.Router();
const { getAllUsers, createAdmin, getStats } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Get Admin Statistics
router.get('/stats', adminMiddleware, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const blogCount = await Blog.countDocuments();
        const activeUsers = await User.countDocuments({ isVerified: true });
        
        res.status(200).json({
            userCount,
            blogCount,
            activeUsers,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});

// Add other admin-related routes here

// Middleware to ensure user is an admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
};

// Admin routes
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.post('/create-admin', authMiddleware, adminMiddleware, createAdmin);
router.get('/stats', authMiddleware, adminMiddleware, getStats);

module.exports = router;
