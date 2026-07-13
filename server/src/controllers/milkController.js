const { body, query } = require('express-validator');
const dayjs = require('dayjs');

const Customer = require('../models/Customer');
const MilkEntry = require('../models/MilkEntry');
const { getApplicablePrice } = require('../services/priceService');
const { normalizeToDayStart } = require('../utils/date');
const { handleValidation } = require('../utils/validation');

const milkValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required.'),
  body('morningMilk').optional().isFloat({ min: 0 }).withMessage('Morning milk must be >= 0.'),
  body('eveningMilk').optional().isFloat({ min: 0 }).withMessage('Evening milk must be >= 0.'),
  body('date').optional().isISO8601().withMessage('Date must be valid ISO date.')
];

const listMilkValidation = [
  query('customerId').optional().isMongoId().withMessage('Customer id must be valid.'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid.'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid.')
];

const upsertMilkEntry = async (req, res, next) => {
  try {
    handleValidation(req);

    const { customerId, morningMilk = 0, eveningMilk = 0, date, notes = '' } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const entryDate = normalizeToDayStart(date || new Date());
    const totalLitres = Number(morningMilk) + Number(eveningMilk);
    const ratePerLitre = await getApplicablePrice(entryDate);
    const totalAmount = Number((totalLitres * ratePerLitre).toFixed(2));

    const entry = await MilkEntry.findOneAndUpdate(
      { customer: customer._id, date: entryDate },
      {
        customer: customer._id,
        date: entryDate,
        morningMilk,
        eveningMilk,
        totalLitres,
        ratePerLitre,
        totalAmount,
        notes
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(201).json({ success: true, data: entry });
  } catch (error) {
    return next(error);
  }
};

const getMilkEntries = async (req, res, next) => {
  try {
    handleValidation(req);

    const filters = {};

    if (req.user.role === 'customer') {
      filters.customer = req.user.customerRef;
    } else if (req.query.customerId) {
      filters.customer = req.query.customerId;
    }

    if (req.query.startDate || req.query.endDate) {
      filters.date = {
        ...(req.query.startDate ? { $gte: dayjs(req.query.startDate).startOf('day').toDate() } : {}),
        ...(req.query.endDate ? { $lte: dayjs(req.query.endDate).endOf('day').toDate() } : {})
      };
    }

    const rows = await MilkEntry.find(filters)
      .populate('customer', 'name customerId mobileNumber')
      .sort({ date: -1 })
      .limit(500);

    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  milkValidation,
  listMilkValidation,
  upsertMilkEntry,
  getMilkEntries
};
