const { body } = require('express-validator');

const User = require('../models/User');
const Customer = require('../models/Customer');
const { generateToken } = require('../utils/jwt');
const { handleValidation } = require('../utils/validation');

const loginValidation = [
  body('phone').notEmpty().withMessage('Phone is required.'),
  body('password').notEmpty().withMessage('Password is required.')
];

const createCustomerUserValidation = [
  body('customerId').notEmpty().withMessage('Customer id is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
];

const login = async (req, res, next) => {
  try {
    handleValidation(req);

    const { phone, password } = req.body;
    const user = await User.findOne({ phone });

    if (!user || !(await user.comparePassword(password))) {
      const error = new Error('Invalid credentials.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account is inactive.');
      error.statusCode = 403;
      throw error;
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          phone: user.phone,
          role: user.role,
          customerRef: user.customerRef
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const createAdminIfNotExists = async (req, res, next) => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      return res.json({ success: true, message: 'Admin already exists.' });
    }

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      phone: process.env.ADMIN_PHONE || '9999999999',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'admin'
    });

    return res.status(201).json({
      success: true,
      message: 'Default admin created.',
      data: { id: admin._id, phone: admin.phone }
    });
  } catch (error) {
    return next(error);
  }
};

const createCustomerLogin = async (req, res, next) => {
  try {
    handleValidation(req);

    const { customerId, password } = req.body;
    const customer = await Customer.findOne({ customerId });

    if (!customer) {
      const error = new Error('Customer not found.');
      error.statusCode = 404;
      throw error;
    }

    const alreadyExists = await User.findOne({ customerRef: customer._id });

    if (alreadyExists) {
      const error = new Error('Customer login already exists.');
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({
      name: customer.name,
      phone: customer.mobileNumber,
      password,
      role: 'customer',
      customerRef: customer._id
    });

    return res.status(201).json({
      success: true,
      message: 'Customer login created successfully.',
      data: { id: user._id }
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res) => {
  return res.json({ success: true, data: req.user });
};

module.exports = {
  loginValidation,
  createCustomerUserValidation,
  login,
  getMe,
  createAdminIfNotExists,
  createCustomerLogin
};
