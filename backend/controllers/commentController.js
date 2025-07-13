const pool = require('../db');

exports.createComment = async (req, res) => {
  const { post_id, content } = req.body;

  // Debugging logs
  console.log('Received post_id:', post_id);
  console.log('Received content:', content);
  console.log('Decoded user from token:', req.user);

  // Check if token was missing or invalid
  if (!req.user || !req.user.id) {
    console.error("No valid user found from token");
    return res.status(401).json({ msg: "Unauthorized - No valid user" });
  }

  const user_id = req.user.id;

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