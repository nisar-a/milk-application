const express = require('express');

const { milkValidation, listMilkValidation, upsertMilkEntry, getMilkEntries } = require('../controllers/milkController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', listMilkValidation, getMilkEntries);
router.post('/', authorize('admin'), milkValidation, upsertMilkEntry);

module.exports = router;
