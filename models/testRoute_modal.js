const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: String,
    //Referenced stop data
    stops: [
      {
        distance: Number,
        number: Number,
        details: { type: mongoose.Schema.Types.ObjectId, ref: "Stop" },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("TestRoute", routeSchema);
// distance: {
//           type: Number,
//           required: [true, "A stop must have a distance"],
//         },
//         number: {
//           type: Number,
//           required: [true, "A stop must have a number"],
//         },
