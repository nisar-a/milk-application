const express = require('express');

const { paymentValidation, listPaymentValidation, createPayment, getPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listPaymentValidation, getPayments);
router.post('/', authorize('admin'), paymentValidation, createPayment);

module.exports = router;
