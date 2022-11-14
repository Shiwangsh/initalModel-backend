const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  regNum: {
    type: String,
    required: [true, "A vehicle must have a registration number"],
    trim: true,
    unique: true,
  },
  capacity: {
    type: Number,
    required: [true, "A vehicle must have a max capacity"],
  },

  route: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
});

module.exports = mongoose.model("Bus", busSchema);
