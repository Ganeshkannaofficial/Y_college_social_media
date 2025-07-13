const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require('../controllers/postController');

const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');

// Posts
router.post('/', authenticateUser, createPost);
router.get('/', getAllPosts);
router.get('/me', authenticateUser, getUserPosts);
router.put('/:id', authenticateUser, editPost);
router.delete('/:id', authenticateUser, deletePost);

// Comments
router.post('/:postId/comment', authenticateUser, createComment);
router.get('/:postId/comment', getCommentsByPost);
router.delete('/:postId/comment/:commentId', authenticateUser, deleteComment);

module.exports = router;
