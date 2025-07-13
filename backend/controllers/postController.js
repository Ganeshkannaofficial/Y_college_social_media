const pool = require('../db');

exports.createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user?.id; // Make sure req.user is coming from token

  if (!content || !userId) {
    return res.status(400).json({ msg: 'Missing content or user ID' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING *',
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.name
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};



exports.getUserPosts = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};