const User = require('../models/User');
const MilkPrice = require('../models/MilkPrice');

const ensureAdminFromEnv = async () => {
  const existingAdmin = await User.findOne({ role: 'admin' });

  if (existingAdmin) {
    return { created: false, phone: existingAdmin.phone, adminId: existingAdmin._id };
  }

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Admin',
    phone: process.env.ADMIN_PHONE || '9999999999',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    role: 'admin'
  });

  return { created: true, phone: admin.phone, adminId: admin._id };
};

const ensureDefaultMilkPrice = async (adminId) => {
  const existingPrice = await MilkPrice.findOne().sort({ effectiveFrom: -1 });

  if (existingPrice) {
    return { created: false, pricePerLitre: existingPrice.pricePerLitre };
  }

  const defaultPrice = Number(process.env.DEFAULT_MILK_PRICE || 40);

  const price = await MilkPrice.create({
    pricePerLitre: defaultPrice,
    // Start from epoch so backdated entries also get a valid base rate.
    effectiveFrom: new Date(0),
    updatedBy: adminId
  });

  return { created: true, pricePerLitre: price.pricePerLitre };
};

module.exports = {
  ensureAdminFromEnv,
  ensureDefaultMilkPrice
};
