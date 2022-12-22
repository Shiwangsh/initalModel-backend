const catchAsync = require("../utils/catchAsync");
const Stop = require("./../models/stop_model");
const factoryController = require("./factoryController");

exports.getAllStopes = factoryController.getAll(Stop);
exports.getStop = factoryController.getOne(Stop);
exports.createStop = factoryController.createOne(Stop);
exports.updateStop = factoryController.updateOne(Stop);

exports.getStopsBySerach = catchAsync(async (req, res) => {
  const search = req.query.search;
  //   console.log(req.query);
  //   console.log(search);
  if (search) {
    const stops = await Stop.find({ name: { $regex: search, $options: "i" } });
    res.status(200).json({
      status: "Success",
      result: stops.length,
      stops,
    });
  }
});

// exports.createStop = catchAsync(async (req, res) => {
//   const array = req.body;
//   console.log(array);
//   const stops = await Stop.insertMany(array);
//   res.status(200).json({
//     status: "Success",
//     result: stops.length,
//     stops,
//   });
// });
