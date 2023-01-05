const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      unique: true,
      required: [true, "A route must have a name"],
    },
    //Embedded stops data
    stops: [
      {
        name: {
          type: String,
          required: [true, "A stop must have a name"],
        },
        number: {
          type: Number,
          required: [true, "A stop must have a number"],
        },
        distance: {
          type: Number,
          required: [true, "A stop must have a distance till next stop"],
        },
        latitude: {
          type: Number,
          required: [true, "A stop must have a Latitudinal position"],
        },
        longitude: {
          type: Number,
          required: [true, "A stop must have a Logitudinal position"],
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Route", routeSchema);
