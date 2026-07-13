const mongoose = require('mongoose');

const milkEntrySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    morningMilk: {
      type: Number,
      default: 0,
      min: 0
    },
    eveningMilk: {
      type: Number,
      default: 0,
      min: 0
    },
    totalLitres: {
      type: Number,
      required: true,
      min: 0
    },
    ratePerLitre: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

milkEntrySchema.index({ customer: 1, date: 1 }, { unique: true });
milkEntrySchema.index({ date: -1 });

module.exports = mongoose.model('MilkEntry', milkEntrySchema);
