const express = require('express');
const router = express.Router();

// Make sure these imports are correct
const { authenticateUser } = require('../middleware/authMiddleware');
const { createPost, getAllPosts, getUserPosts } = require('../controllers/postController');


module.exports = router;
// POST /api/posts → create a new post
router.post('/', authenticateUser, createPost);

// GET /api/posts → get all posts
router.get('/', getAllPosts);

// GET /api/posts/me → get current user's posts
router.get('/me', authenticateUser, getUserPosts);


module.exports = router;