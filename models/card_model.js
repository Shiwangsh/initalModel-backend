const mongoose = require("mongoose");
const short = require("short-uuid");

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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

//Transaction Virtual Property
// cardSchema.virtual("balanceUpdated").get(function () {
//   return +this.balance.toFixed(1);
// });

cardSchema.virtual("transactions", {
  ref: "Transaction",
  foreignField: "card",
  localField: "uuid",
});

module.exports = mongoose.model("Card", cardSchema);
