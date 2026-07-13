const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      const error = new Error('Unauthorized: token missing.');
      error.statusCode = 401;
      throw error;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      const error = new Error('Unauthorized: user not found or inactive.');
      error.statusCode = 401;
      throw error;
    }

    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    const error = new Error('Forbidden: insufficient permissions.');
    error.statusCode = 403;
    return next(error);
  }

  return next();
};

module.exports = {
  protect,
  authorize
};
