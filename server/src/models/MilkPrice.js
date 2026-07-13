const mongoose = require('mongoose');

const milkPriceSchema = new mongoose.Schema(
  {
    pricePerLitre: {
      type: Number,
      required: true,
      min: 0
    },
    effectiveFrom: {
      type: Date,
      required: true,
      default: Date.now
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

milkPriceSchema.index({ effectiveFrom: -1 });

module.exports = mongoose.model('MilkPrice', milkPriceSchema);
