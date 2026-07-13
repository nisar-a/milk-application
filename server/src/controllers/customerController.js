const { body, query } = require('express-validator');

const Customer = require('../models/Customer');
const { handleValidation } = require('../utils/validation');

const customerValidation = [
  body('customerId').notEmpty().withMessage('Customer ID is required.'),
  body('name').notEmpty().withMessage('Name is required.'),
  body('mobileNumber').notEmpty().withMessage('Mobile number is required.'),
  body('address').notEmpty().withMessage('Address is required.')
];

const listCustomerValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer.'),
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('Limit must be between 1-200.')
];

const createCustomer = async (req, res, next) => {
  try {
    handleValidation(req);

    const customer = await Customer.create(req.body);
    return res.status(201).json({ success: true, data: customer });
  } catch (error) {
    if (error.code === 11000) {
      error.statusCode = 409;
      error.message = 'Customer ID already exists.';
    }

    return next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    return res.json({ success: true, data: customer });
  } catch (error) {
    return next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    return res.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (error) {
    return next(error);
  }
};

const getCustomers = async (req, res, next) => {
  try {
    handleValidation(req);

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const search = req.query.search || '';
    const status = req.query.status || '';

    const filters = {
      ...(status ? { status } : {}),
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { mobileNumber: { $regex: search, $options: 'i' } },
              { customerId: { $regex: search, $options: 'i' } }
            ]
          }
        : {})
    };

    const [rows, total] = await Promise.all([
      Customer.find(filters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Customer.countDocuments(filters)
    ]);

    return res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    return res.json({ success: true, data: customer });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  customerValidation,
  listCustomerValidation,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById
};
