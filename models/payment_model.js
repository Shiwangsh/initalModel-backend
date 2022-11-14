const mongoose = require("mongoose");

const paymnetSchema = new mongoose.Schema(
  {
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      unique: false,
      ref: "Transaction",
    },
    amount: Number,
    balanceBefore: Number,
    balanceAfter: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymnetSchema);
