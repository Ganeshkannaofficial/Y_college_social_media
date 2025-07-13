const pool = require('../db');

exports.createComment = async (req, res) => {
  const { post_id, content } = req.body;
  const user_id = req.user?.id;

  if (!user_id || !content) {
    return res.status(400).json({ msg: 'Missing content or user' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [post_id, user_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(' Error creating comment:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.getCommentsByPost = async (req, res) => {
  const { postId } = req.params;
  try {
    const result = await pool.query(
      `SELECT comments.*, users.name
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`,
      [postId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const user = req.user;

  try {
    const result = await pool.query('SELECT * FROM comments WHERE id = $1 AND post_id = $2', [
      commentId,
      postId,
    ]);

    if (result.rows.length === 0) return res.status(404).json({ msg: 'Comment not found' });

    const comment = result.rows[0];

    if (comment.user_id !== user.id && user.role !== 'faculty' && user.role !== 'admin')
      return res.status(403).json({ msg: 'Unauthorized to delete this comment' });

    await pool.query('DELETE FROM comments WHERE id = $1', [commentId]);
    res.json({ msg: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
