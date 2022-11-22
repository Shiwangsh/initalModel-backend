const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {};
    if (req.query.search)
      filter = { name: { $regex: req.query.search, $options: "i" } };
    if (req.params.cardId) filter = { card: req.params.cardId };
    console.log(filter);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort();
    const doc = await features.query;
    res.status(200).json({
      status: "Success",
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new ApiError("No doc found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new ApiError("No doc found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.find(req.params.id);

    if (!doc) {
      return next(new ApiError("No doc found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: "delete bad!(Remove route later)",
    });
  });

// exports.deleteOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const doc = await Model.findByIdAndDelete(req.params.id);

//     if (!doc) {
//       return next(new ApiError("No doc found with that ID", 404));
//     }

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   });

exports.toggleActive = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    await Model.findByIdAndUpdate(req.params.id, [
      { $set: { active: { $not: "$active" } } },
    ]);
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
