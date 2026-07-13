const { body } = require('express-validator');

const MilkPrice = require('../models/MilkPrice');
const { handleValidation } = require('../utils/validation');

const updatePriceValidation = [
  body('pricePerLitre').isFloat({ min: 0 }).withMessage('Price must be positive number.'),
  body('effectiveFrom').optional().isISO8601().withMessage('Effective from date must be valid.')
];

const createPrice = async (req, res, next) => {
  try {
    handleValidation(req);

    const price = await MilkPrice.create({
      pricePerLitre: req.body.pricePerLitre,
      effectiveFrom: req.body.effectiveFrom || new Date(),
      updatedBy: req.user._id
    });

    return res.status(201).json({ success: true, data: price });
  } catch (error) {
    return next(error);
  }
};

const getCurrentPrice = async (_req, res, next) => {
  try {
    const price = await MilkPrice.findOne({ effectiveFrom: { $lte: new Date() } }).sort({ effectiveFrom: -1 });

    return res.json({
      success: true,
      data: price || { pricePerLitre: 40, effectiveFrom: new Date() }
    });
  } catch (error) {
    return next(error);
  }
};

const getPriceHistory = async (_req, res, next) => {
  try {
    const history = await MilkPrice.find().sort({ effectiveFrom: -1 }).limit(100);
    return res.json({ success: true, data: history });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updatePriceValidation,
  createPrice,
  getCurrentPrice,
  getPriceHistory
};
