const express = require('express');
const router = express.Router();
const { getLikes, getComments, toggleAdminBlock, deleteBlog, deleteComment } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Admin routes
router.get('/likes', authMiddleware, adminMiddleware, getLikes); // Get all likes
router.get('/comments', authMiddleware, adminMiddleware, getComments); // Get all comments
router.post('/toggle-admin-block', authMiddleware, adminMiddleware, toggleAdminBlock); // Block/Unblock admin
router.delete('/delete-blog/:blogId', authMiddleware, adminMiddleware, deleteBlog); // Delete harmful blog
router.delete('/delete-comment/:commentId', authMiddleware, adminMiddleware, deleteComment); // Delete harmful comment

module.exports = router;
