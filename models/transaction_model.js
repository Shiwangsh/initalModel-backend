const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    card: {
      type: mongoose.Schema.Types.String,
      ref: "Card",
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
    },
    type: {
      type: String,
      enum: ["Load Balance", "Ticket"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

transactionSchema.virtual("ticket", {
  ref: "Ticket",
  foreignField: "transaction",
  localField: "_id",
});
transactionSchema.virtual("payment", {
  ref: "Payment",
  foreignField: "transaction",
  localField: "_id",
});
module.exports = mongoose.model("Transaction", transactionSchema);
