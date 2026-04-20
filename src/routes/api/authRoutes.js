const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
} = require('../../controllers/authController');
const { protect } = require('../../middlewares/authMiddleware');
const { validateRegister, validateLogin } = require('../../middlewares/validationMiddleware');

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);

module.exports = router;