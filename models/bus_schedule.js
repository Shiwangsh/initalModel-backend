const mongoose = require("mongoose");

const busScheduleSchema = new mongoose.Schema({
  startLocation: {
    //GeoJSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  endLocation: {
    //GeoJSON
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  startTime: {
    type: Number,
    required: [true, "A bus schedule must have a starting time"],
  },
  endTime: {
    type: Number,
    required: [true, "A bus schedule must have a end time"],
  },
  date: {
    type: Date,
    required: true,
    min: Date.now(),
    default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
  },
});
module.exports = mongoose.model("BusSchedule", busScheduleSchema);
