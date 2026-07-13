const express = require('express');

const {
  loginValidation,
  createCustomerUserValidation,
  login,
  getMe,
  createAdminIfNotExists,
  createCustomerLogin
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginValidation, login);
router.post('/bootstrap-admin', createAdminIfNotExists);
router.get('/me', protect, getMe);
router.post('/customer-login', protect, authorize('admin'), createCustomerUserValidation, createCustomerLogin);

module.exports = router;
