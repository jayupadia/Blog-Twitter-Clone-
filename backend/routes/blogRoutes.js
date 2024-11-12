const express = require('express');
const { createBlog, likeBlog, commentBlog, replyComment } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Blog routes
router.post('/create', authMiddleware, createBlog);
router.post('/:id/like', authMiddleware, likeBlog);
router.post('/:id/comment', authMiddleware, commentBlog);
router.post('/:id/comment/reply', authMiddleware, replyComment);

module.exports = router;
