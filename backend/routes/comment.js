const express = require('express');
const router = express.Router();
const { createComment, getCommentsByPost } = require('../controllers/commentController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, createComment);
router.get('/:postId', getCommentsByPost);

module.exports = router;
