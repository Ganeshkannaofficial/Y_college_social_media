const express = require('express');
const router = express.Router();
const db = require('../db');  // your database connection module
const { authenticateAdmin } = require('../middleware/authMiddleware');
const pool = require('../db');

// GET all pending users
router.get('/pending-users', authenticateAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, roll_no, role FROM users WHERE approved = FALSE"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// POST approve a user by id
router.post('/approve-user/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET approved = TRUE WHERE id = $1", [id]);
    res.json({ message: 'User approved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
