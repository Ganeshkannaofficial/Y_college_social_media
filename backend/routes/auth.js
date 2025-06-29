const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  adminLogin,
  approveUser
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.post('/admin/approve', approveUser);

module.exports = router;
