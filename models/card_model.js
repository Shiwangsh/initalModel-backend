const mongoose = require("mongoose");
const short = require("short-uuid");
const { db } = require("./user_model");

const cardSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      required: [true, "A card must have a certain balance"],
      default: 100,
    },
    cardType: {
      type: String,
      enum: ["Standard", "Student", "Senior"],
      // default: "Standard",
      required: [true, "A card must have a certain type"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "User",
    },
    uuid: {
      type: String,
      default: short.generate,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
