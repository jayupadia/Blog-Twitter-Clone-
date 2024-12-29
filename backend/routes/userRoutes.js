const express = require('express');
const { createBlog, viewBlogs, likeBlog, editProfile, searchBlogs } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.post('/create', authMiddleware, createBlog);
router.get('/view', viewBlogs);
router.post('/:id/like', authMiddleware, likeBlog);
router.put('/edit-profile', authMiddleware, editProfile);
router.get('/search', searchBlogs);

module.exports = router;
