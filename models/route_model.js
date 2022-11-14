const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: String,
    //Embedded stops data
    stops: [
      {
        name: String,
        number: Number,
        distance: Number,
        latitude: Number,
        longitude: Number,
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Route", routeSchema);
