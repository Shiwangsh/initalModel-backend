const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A stop must have a name"],
    },
    stopNumber: {
      type: Number,
      required: [true, "A stop must have a number"],
    },
    distance: {
      type: Number,
      required: [true, "A stop must have a distance"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.module("Stop", stopSchema);
