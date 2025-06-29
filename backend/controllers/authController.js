const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Signup (Pending approval)
exports.signup = async (req, res) => {
  const { name, roll_no, email, role, password } = req.body;

  try {
    console.log('Received signup:', req.body);  // See exactly what you're receiving

    const userExists = await pool.query(
      'SELECT * FROM users WHERE email=$1 OR roll_no=$2',
      [email, roll_no]
    );

    if (userExists.rows.length > 0) {
      console.log('User already exists.');
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (name, roll_no, email, role, password, approved) VALUES ($1, $2, $3, $4, $5, $6)',
      [name, roll_no, email, role, hashedPassword, false]
    );

    console.log('User inserted successfully');
    res.status(200).json({ msg: 'Signup successful. Wait for admin approval.' });

  } catch (err) {
    console.error('Signup error:', err);  // ← THIS will print the real error
    res.status(500).json({ msg: 'Server error during signup' });
  }
};


// Admin Login
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;
  console.log('Admin login attempt:', username);

  try {
    const adminRes = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = adminRes.rows[0];
    if (!admin) {
      console.log('Admin not found');
      return res.status(401).json({ msg: 'Admin not found' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


// Approve user
exports.approveUser = async (req, res) => {
  const { userId, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query('UPDATE users SET approved=true, password=$1 WHERE id=$2', [hashed, userId]);
  res.status(200).json({ msg: 'User approved' });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Check if user is approved
    if (!user.approved) {
      return res.status(403).json({ msg: 'Your account is pending admin approval' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error' });
  }
};

