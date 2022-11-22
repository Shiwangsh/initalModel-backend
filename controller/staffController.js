const Staff = require("./../models/staff_model");
const factoryController = require("./factoryController");

exports.getAllStaffs = factoryController.getAll(Staff);
exports.createStaff = factoryController.createOne(Staff);
exports.getStaff = factoryController.getOne(Staff);
exports.updateStaff = factoryController.updateOne(Staff);
exports.deleteStaff = factoryController.deleteOne(Staff);
exports.toggleActive = factoryController.toggleActive(Staff);

// exports.getAllStaffs = catchAsync(async (req, res) => {
//   const search = req.query.search || "";
//   console.log(req.query);
//   const features = new APIFeatures(
//     Staff.find({ name: { $regex: search, $options: "i" } }),
//     req.query
//   )
//     .filter()
//     .sort();

//   const staffs = await features.query;
//   res.status(200).json({
//     status: "Success",
//     result: staffs.length,
//     staffs,
//   });
// });

// exports.createStaff = async (req, res) => {
//   try {
//     console.log(req.body);

//     const newStaff = await Staff.create({
//       name: req.body.name,
//       address: req.body.address,
//       contactNumber: req.body.contactNumber,
//       staffType: req.body.staffType,
//       email: req.body.email,
//       password: req.body.password,
//     });
//     res.status(201).json({
//       status: "success",
//       newStaff,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err.message,
//     });
//   }
// };

// exports.getStaff = async (req, res) => {
//   try {
//     const staff = await Staff.findById(req.params.id);
//     res.status(201).json({
//       status: "success",
//       staff,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// };
// exports.updateStaff = async (req, res) => {
//   try {
//     const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({
//       status: "success",
//       staff,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: "Invalid data sent!😥",
//     });
//   }
// };
// exports.deleteStaff = async (req, res) => {
//   try {
//     console.log(req.params.id);
//     await Staff.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch {
//     res.status(400).json({
//       status: "error",
//       message: "No no why send wrong data",
//     });
//   }
// };
