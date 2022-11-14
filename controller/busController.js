const Bus = require("./../models/bus_model");
const Route = require("../models/route_model");

const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getBuses = catchAsync(async (req, res, next) => {
  const search = req.query.search || "";

  // var ObjectId = require("mongoose").Types.ObjectId;
  // var query = { _id: new ObjectId(search) };
  const features = new APIFeatures(
    Bus.find({ regNum: { $regex: search, $options: "i" } }).populate("route"),
    req.query
  )
    .filter()
    .sort();

  const buses = await features.query;

  res.status(200).json({
    status: "Success",
    result: buses.length,
    buses,
  });
});

exports.createBus = catchAsync(async (req, res, next) => {
  try {
    if (!req.body) {
      next(new ApiError("Please enter the required fields", 400));
    }
    const newBus = await Bus.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        bus: newBus,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

exports.getBus = catchAsync(async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    next(new ApiError("Invalid id or bus does not exist"));
  }
  res.status(201).json({
    status: "success",
    data: {
      bus,
    },
  });
});

exports.updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bus) {
      next(new ApiError("Invalid id or bus does not exist"));
    }
    res.status(200).json({
      status: "success",
      bus,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!😥",
    });
  }
};

/*
 * Bus routes**
 */

exports.getAllRoutes = catchAsync(async (req, res, next) => {
  const allRoutes = await Route.find();
  if (allRoutes.length == 0) {
    next(new ApiError("Sorry no bus exist currently", 400));
  }
  res.status(200).json({
    status: "Success",
    result: allRoutes.length,
    allRoutes,
  });
});

exports.getBusRoute = catchAsync(async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) {
    next(new ApiError("Invalid id or route does not exist"));
  }
  res.status(201).json({
    status: "success",
    data: {
      route,
    },
  });
});

exports.createRoute = catchAsync(async (req, res, next) => {
  if (!req.body) {
    next(new ApiError("Please enter the required foelds", 400));
  }
  const route = await Route.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      route,
    },
  });
});
