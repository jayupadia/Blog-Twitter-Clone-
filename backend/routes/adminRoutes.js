const express = require('express');
const router = express.Router();
const { 
  getLikes, 
  getComments, 
  toggleAdminBlock, 
  deleteBlog, 
  deleteComment,
  logout // Add logout to the imports
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Combine middlewares for better readability
const adminAuth = [protect, adminOnly];

// Admin routes
router.get('/likes', adminAuth, getLikes); // Get all likes
router.get('/comments', adminAuth, getComments); // Get all comments
router.post('/toggle-admin-block', adminAuth, toggleAdminBlock); // Block/Unblock admin
router.delete('/delete-blog/:blogId', adminAuth, deleteBlog); // Delete harmful blog
router.delete('/delete-comment/:commentId', adminAuth, deleteComment); // Delete harmful comment
router.post('/logout', adminAuth, logout); // Ensure this line is present

module.exports = router;
