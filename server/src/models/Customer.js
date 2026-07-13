const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    mobileNumber: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    joiningDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

customerSchema.index({ name: 'text', customerId: 'text', mobileNumber: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
