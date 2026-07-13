const MilkEntry = require('../models/MilkEntry');
const Payment = require('../models/Payment');
const { getMonthRange } = require('../utils/date');

const getCustomerMonthlyBill = async (customerId, month) => {
  const { start, end } = getMonthRange(month);

  const entries = await MilkEntry.find({
    customer: customerId,
    date: { $gte: start, $lte: end }
  }).sort({ date: 1 });

  const totalLitres = entries.reduce((sum, item) => sum + item.totalLitres, 0);
  const totalAmount = entries.reduce((sum, item) => sum + item.totalAmount, 0);

  const payments = await Payment.find({ customer: customerId, month });
  const paidAmount = payments.reduce((sum, item) => sum + item.paidAmount, 0);
  const dueAmount = Math.max(totalAmount - paidAmount, 0);

  return {
    month,
    totalLitres,
    totalAmount,
    paidAmount,
    dueAmount,
    entries,
    paymentStatus: dueAmount === 0 ? 'paid' : paidAmount === 0 ? 'pending' : 'partial'
  };
};

module.exports = {
  getCustomerMonthlyBill
};
