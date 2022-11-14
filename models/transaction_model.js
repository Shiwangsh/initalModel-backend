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
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
