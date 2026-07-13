const express = require('express');

const {
  customerValidation,
  listCustomerValidation,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomerById
} = require('../controllers/customerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(authorize('admin'), listCustomerValidation, getCustomers)
  .post(authorize('admin'), customerValidation, createCustomer);

router
  .route('/:id')
  .get(authorize('admin'), getCustomerById)
  .put(authorize('admin'), updateCustomer)
  .delete(authorize('admin'), deleteCustomer);

module.exports = router;
