const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/authMiddleware');
const {
  createPost,
  getAllPosts,
  getUserPosts,
  editPost,
  deletePost,
  getOfficialPosts,
  reactToPost, 
} = require('../controllers/postController');

const {
  createComment,
  getCommentsByPost,
  deleteComment,
} = require('../controllers/commentController');

// Official posts route — static path first!
router.get('/official', authenticateUser, getOfficialPosts);

// Post routes
router.post('/', authenticateUser, createPost);
router.get('/', getAllPosts);
router.get('/me', authenticateUser, getUserPosts);
router.put('/:id', authenticateUser, editPost);
router.delete('/:id', authenticateUser, deletePost);

// Comments routes
router.post('/:postId/comment', authenticateUser, createComment);
router.get('/:postId/comment', getCommentsByPost);
router.delete('/:postId/comment/:commentId', authenticateUser, deleteComment);

//  React to Post — after static routes
router.post('/:postId/react', authenticateUser, reactToPost);

module.exports = router;
