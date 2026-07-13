const { body, query } = require('express-validator');

const Customer = require('../models/Customer');
const Payment = require('../models/Payment');
const { getCustomerMonthlyBill } = require('../services/billingService');
const { handleValidation } = require('../utils/validation');

const paymentValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required.'),
  body('month').matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage('Month must be in YYYY-MM format.'),
  body('paidAmount').isFloat({ min: 0 }).withMessage('Paid amount must be >= 0.'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'upi', 'bank-transfer'])
    .withMessage('Invalid payment method.')
];

const listPaymentValidation = [
  query('month').optional().matches(/^\d{4}-(0[1-9]|1[0-2])$/).withMessage('Month must be in YYYY-MM format.')
];

const createPayment = async (req, res, next) => {
  try {
    handleValidation(req);

    const { customerId, month, paidAmount, paymentMethod = 'cash', paymentDate, referenceNote } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const bill = await getCustomerMonthlyBill(customer._id, month);
    const totalPaidSoFar = bill.paidAmount + Number(paidAmount);
    const status = totalPaidSoFar >= bill.totalAmount ? 'paid' : totalPaidSoFar === 0 ? 'pending' : 'partial';

    const payment = await Payment.create({
      customer: customer._id,
      month,
      billedAmount: bill.totalAmount,
      paidAmount,
      status,
      paymentDate: paymentDate || new Date(),
      paymentMethod,
      referenceNote
    });

    return res.status(201).json({ success: true, data: payment });
  } catch (error) {
    return next(error);
  }
};

const getPayments = async (req, res, next) => {
  try {
    handleValidation(req);

    const filters = {};

    if (req.user.role === 'customer') {
      filters.customer = req.user.customerRef;
    } else if (req.query.customerId) {
      filters.customer = req.query.customerId;
    }

    if (req.query.month) {
      filters.month = req.query.month;
    }

    const rows = await Payment.find(filters)
      .populate('customer', 'name customerId mobileNumber')
      .sort({ paymentDate: -1 })
      .limit(500);

    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  paymentValidation,
  listPaymentValidation,
  createPayment,
  getPayments
};
