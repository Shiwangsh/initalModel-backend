const Route = require("../models/route_model");
const factoryController = require("./factoryController");

exports.getAllRoutes = factoryController.getAll(Route);
exports.getRoute = factoryController.getOne(Route);
exports.createRoute = factoryController.createOne(Route);

// exports.getAllRoutes = catchAsync(async (req, res, next) => {
//   const search = req.query.search || "";
//   console.log(req.query);
//   const features = new APIFeatures(
//     Route.find({
//       routeName: { $regex: search, $options: "i" },
//     }),
//     req.query
//   )
//     .filter()
//     .sort();
//   const routes = await features.query;
//   // const routes = await Route.find({
//   //   name: { $regex: search, $options: "i" },
//   // });
//   if (routes.length == 0) {
//     next(new ApiError("Sorry no bus exist currently", 400));
//   }
//   res.status(200).json({
//     status: "Success",
//     result: routes.length,
//     routes,
//   });
// });

// exports.getRoute = catchAsync(async (req, res) => {
//   const route = await Route.findById(req.params.id);
//   if (!route) {
//     return new ApiError("Invalid id or route does not exist");
//   }
//   res.status(201).json({
//     status: "success",
//     route,
//   });
// });

// exports.createRoute = catchAsync(async (req, res, next) => {
//   console.log(req.body.stops["number"]);
//   if (!req.body) {
//     next(new ApiError("Please enter the required foelds", 400));
//   }
//   const route = await Route.create(req.body);
//   res.status(201).json({
//     status: "success",
//     route,
//   });
// });
