const pool = require('../db');

// Create Post
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

// Get All Posts with User Names
exports.getAllPosts = async (req, res) => {
  const userId = req.user?.id || null; // User ID if logged in, else null

  try {
    const result = await pool.query(`
      SELECT 
        posts.*, 
        users.name,
        COALESCE(like_counts.count, 0) AS like_count,
        COALESCE(heart_counts.count, 0) AS heart_count,
        COALESCE(dislike_counts.count, 0) AS dislike_count,
        user_reactions.reaction AS user_reaction
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS count FROM post_reactions WHERE reaction = 'like' GROUP BY post_id
      ) like_counts ON posts.id = like_counts.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS count FROM post_reactions WHERE reaction = 'heart' GROUP BY post_id
      ) heart_counts ON posts.id = heart_counts.post_id
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS count FROM post_reactions WHERE reaction = 'dislike' GROUP BY post_id
      ) dislike_counts ON posts.id = dislike_counts.post_id
      LEFT JOIN (
        SELECT post_id, reaction FROM post_reactions WHERE user_id = $1
      ) user_reactions ON posts.id = user_reactions.post_id
      ORDER BY posts.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching posts with reactions:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Get User's Posts
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

// Edit Post
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

// Delete Post
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

// Get Official Posts
exports.getOfficialPosts = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT posts.*, users.name, users.role
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE users.role IN ('faculty', 'club')
       ORDER BY posts.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching official posts:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// React to Post
exports.reactToPost = async (req, res) => {
  const userId = req.user.id;
  const postId = parseInt(req.params.postId);
  const { reaction } = req.body;

  console.log('Reacting to post:', { postId, userId, reaction });

  try {
    // Insert or update user reaction for the post
    const existing = await pool.query(
      'SELECT * FROM post_reactions WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'UPDATE post_reactions SET reaction = $1 WHERE post_id = $2 AND user_id = $3',
        [reaction, postId, userId]
      );
      console.log('Updated existing reaction');
    } else {
      await pool.query(
        'INSERT INTO post_reactions (post_id, user_id, reaction) VALUES ($1, $2, $3)',
        [postId, userId, reaction]
      );
      console.log('Inserted new reaction');
    }

    // Recalculate counts for the post
    const countsResult = await pool.query(
      `SELECT
         SUM(CASE WHEN reaction = 'like' THEN 1 ELSE 0 END) AS like_count,
         SUM(CASE WHEN reaction = 'heart' THEN 1 ELSE 0 END) AS heart_count,
         SUM(CASE WHEN reaction = 'dislike' THEN 1 ELSE 0 END) AS dislike_count
       FROM post_reactions
       WHERE post_id = $1`,
      [postId]
    );

    const { like_count, heart_count, dislike_count } = countsResult.rows[0];

    // Update posts table with new counts
    await pool.query(
      `UPDATE posts SET like_count = $1, heart_count = $2, dislike_count = $3 WHERE id = $4`,
      [like_count || 0, heart_count || 0, dislike_count || 0, postId]
    );

    res.status(200).json({ message: 'Reaction registered successfully' });
  } catch (error) {
    console.error('Error in reactToPost:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to register reaction' });
  }
};



