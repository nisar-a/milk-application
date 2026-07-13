const express = require('express');

const { getMonthlyBill, exportBillPdf, exportBillExcel } = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/monthly', getMonthlyBill);
router.get('/monthly/pdf', exportBillPdf);
router.get('/monthly/excel', exportBillExcel);

module.exports = router;
