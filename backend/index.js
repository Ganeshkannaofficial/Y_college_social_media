require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/auth');

app.use(cors());
app.use(express.json());
const adminRoutes = require('./routes/admin');

// your existing middlewares & routes
app.use('/admin', adminRoutes);

app.use('/api/auth', authRoutes);

const postRoutes = require('./routes/post');
app.use('/api/posts', postRoutes);

const commentRoutes = require('./routes/comment');
app.use('/api/comments', commentRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('DB connected at:', res.rows[0].now);
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
