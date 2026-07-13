const dayjs = require('dayjs');

const Customer = require('../models/Customer');
const MilkEntry = require('../models/MilkEntry');
const Payment = require('../models/Payment');

const getDashboardStats = async (_req, res, next) => {
  try {
    const todayStart = dayjs().startOf('day').toDate();
    const todayEnd = dayjs().endOf('day').toDate();
    const monthStart = dayjs().startOf('month').toDate();
    const monthEnd = dayjs().endOf('month').toDate();

    const [
      totalCustomers,
      todayEntries,
      monthEntries,
      recentPayments,
      pendingSummary,
      chartRows,
      paidCustomersCount
    ] = await Promise.all([
      Customer.countDocuments({ status: 'active' }),
      MilkEntry.find({ date: { $gte: todayStart, $lte: todayEnd } }),
      MilkEntry.find({ date: { $gte: monthStart, $lte: monthEnd } }),
      Payment.find().sort({ paymentDate: -1 }).limit(10).populate('customer', 'name customerId'),
      Payment.aggregate([
        { $group: { _id: '$status', total: { $sum: '$paidAmount' } } }
      ]),
      MilkEntry.aggregate([
        { $match: { date: { $gte: dayjs().subtract(9, 'day').startOf('day').toDate() } } },
        {
          $group: {
            _id: {
              y: { $year: '$date' },
              m: { $month: '$date' },
              d: { $dayOfMonth: '$date' }
            },
            totalLitres: { $sum: '$totalLitres' },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1 } }
      ]),
      Payment.distinct('customer', { status: 'paid', month: dayjs().format('YYYY-MM') })
    ]);

    const morningMilk = todayEntries.reduce((sum, item) => sum + item.morningMilk, 0);
    const eveningMilk = todayEntries.reduce((sum, item) => sum + item.eveningMilk, 0);
    const todayMilk = todayEntries.reduce((sum, item) => sum + item.totalLitres, 0);
    const todayIncome = todayEntries.reduce((sum, item) => sum + item.totalAmount, 0);
    const monthIncome = monthEntries.reduce((sum, item) => sum + item.totalAmount, 0);

    const pendingPayments = pendingSummary.reduce((acc, item) => {
      acc[item._id] = item.total;
      return acc;
    }, {});

    return res.json({
      success: true,
      data: {
        totalCustomers,
        todayMilk,
        morningMilk,
        eveningMilk,
        todayIncome,
        monthIncome,
        pendingPayments,
        paidCustomers: paidCustomersCount.length,
        charts: chartRows.map((item) => ({
          date: `${item._id.y}-${String(item._id.m).padStart(2, '0')}-${String(item._id.d).padStart(2, '0')}`,
          milk: item.totalLitres,
          revenue: item.revenue
        })),
        recentTransactions: recentPayments
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDashboardStats
};
