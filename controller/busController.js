const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const Bus = require("./../models/bus_model");
const factoryController = require("./factoryController");

exports.getAllBuses = factoryController.getAll(Bus);
exports.getBus = factoryController.getOne(Bus, { path: "route" });
exports.createBus = factoryController.createOne(Bus);
exports.updateBus = factoryController.updateOne(Bus);

// exports.getAllBuses = catchAsync(async (req, res) => {
//   //   let filter = {};
//   //   if (req.query.search)
//   //     filter = { name: { $regex: req.query.search, $options: "i" } };
//   //   if (req.params.cardId) filter = { card: req.params.cardId };
//   //   console.log(filter);
//   const features = new APIFeatures(Bus.find().populate("route"), req.query)
//     .filter()
//     .sort();
//   const buses = await features.query;
//   res.status(200).json({
//     status: "Success",
//     result: buses.length,
//     buses,
//   });
// });
