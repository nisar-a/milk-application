const express = require('express');

const { getDailyReport, getWeeklyReport, getMonthlyReport, getYearlyReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/daily', getDailyReport);
router.get('/weekly', getWeeklyReport);
router.get('/monthly', getMonthlyReport);
router.get('/yearly', getYearlyReport);

module.exports = router;
