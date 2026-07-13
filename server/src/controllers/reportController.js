const dayjs = require('dayjs');

const MilkEntry = require('../models/MilkEntry');

const buildReport = async (startDate, endDate) => {
  const entries = await MilkEntry.find({
    date: { $gte: startDate, $lte: endDate }
  }).populate('customer', 'name customerId');

  const totals = entries.reduce(
    (acc, row) => {
      acc.totalLitres += row.totalLitres;
      acc.totalIncome += row.totalAmount;
      return acc;
    },
    { totalLitres: 0, totalIncome: 0 }
  );

  const customerWise = entries.reduce((acc, row) => {
    const key = row.customer.customerId;

    if (!acc[key]) {
      acc[key] = {
        customerId: row.customer.customerId,
        name: row.customer.name,
        totalLitres: 0,
        totalIncome: 0
      };
    }

    acc[key].totalLitres += row.totalLitres;
    acc[key].totalIncome += row.totalAmount;

    return acc;
  }, {});

  return {
    totals,
    entries,
    customerWise: Object.values(customerWise)
  };
};

const getDailyReport = async (req, res, next) => {
  try {
    const date = req.query.date ? dayjs(req.query.date) : dayjs();
    const data = await buildReport(date.startOf('day').toDate(), date.endOf('day').toDate());
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getWeeklyReport = async (_req, res, next) => {
  try {
    const now = dayjs();
    const data = await buildReport(now.startOf('week').toDate(), now.endOf('week').toDate());
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getMonthlyReport = async (req, res, next) => {
  try {
    const month = req.query.month || dayjs().format('YYYY-MM');
    const anchor = dayjs(`${month}-01`);
    const data = await buildReport(anchor.startOf('month').toDate(), anchor.endOf('month').toDate());
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

const getYearlyReport = async (req, res, next) => {
  try {
    const year = Number(req.query.year || dayjs().year());
    const anchor = dayjs(`${year}-01-01`);
    const data = await buildReport(anchor.startOf('year').toDate(), anchor.endOf('year').toDate());
    return res.json({ success: true, data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getYearlyReport
};
