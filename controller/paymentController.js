const Payment = require("./../models/payment_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllPayments = catchAsync(async (req, res) => {
  // const page = parseInt(req.query.page) - 1 || 0;
  // const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const features = new APIFeatures(Payment.find(), req.query).filter().sort();
  const payments = await features.query;

  // const payments = await Payment.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "Success",
    result: payments.length,
    payments,
  });
});

exports.getPaymentsFromCard = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const payments = await Payment.find({ transaction: req.params.id });
  if (!payments) new ApiError("Invalid ID or card does not exist");
  res.status(201).json({
    status: "success",
    payments,
  });
});
