const pool = require('../db');

exports.createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user?.id;

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

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const user = req.user;

  try {
    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ msg: 'Post not found' });

    const post = existing.rows[0];

    if (post.user_id !== user.id)
      return res.status(403).json({ msg: 'Unauthorized to edit this post' });

    const result = await pool.query(
      'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *',
      [content, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error editing post:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const existing = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (existing.rows.length === 0) return res.status(404).json({ msg: 'Post not found' });

    const post = existing.rows[0];

    if (post.user_id !== user.id && user.role !== 'faculty' && user.role !== 'admin')
      return res.status(403).json({ msg: 'Unauthorized to delete this post' });

    await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};
