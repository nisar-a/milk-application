const express = require('express');

const { updatePriceValidation, createPrice, getCurrentPrice, getPriceHistory } = require('../controllers/priceController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/current', protect, getCurrentPrice);
router.get('/history', protect, authorize('admin'), getPriceHistory);
router.post('/', protect, authorize('admin'), updatePriceValidation, createPrice);

module.exports = router;
