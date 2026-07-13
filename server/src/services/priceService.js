const MilkPrice = require('../models/MilkPrice');

const getApplicablePrice = async (targetDate = new Date()) => {
  const price = await MilkPrice.findOne({
    effectiveFrom: { $lte: targetDate }
  }).sort({ effectiveFrom: -1 });

  if (!price) {
    return Number(process.env.DEFAULT_MILK_PRICE || 40);
  }

  return price.pricePerLitre;
};

module.exports = {
  getApplicablePrice
};
