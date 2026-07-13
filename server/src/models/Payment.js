const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-(0[1-9]|1[0-2])$/
    },
    billedAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paidAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'partial'],
      required: true
    },
    paymentDate: {
      type: Date,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'bank-transfer'],
      default: 'cash'
    },
    referenceNote: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

paymentSchema.index({ customer: 1, month: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
