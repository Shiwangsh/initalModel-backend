const mongoose = require("mongoose");
const short = require("short-uuid");

const ticketSchema = new mongoose.Schema(
  {
    amount: Number,

    //which card and vehicle ticket is issued
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      unique: false,
      ref: "Transaction",
    },
    routeName: String,
    firstStop: Number,
    lastStop: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
