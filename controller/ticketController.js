const Ticket = require("./../models/ticket_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllTickets = catchAsync(async (req, res) => {
  // const page = parseInt(req.query.page) - 1 || 0;
  // const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const features = new APIFeatures(Ticket.find(), req.query).filter().sort();
  const tickets = await features.query;
  // const tickets = await Ticket.find({
  //   uuid: { $regex: search, $options: "i" },
  // });

  res.status(200).json({
    status: "Success",
    result: tickets.length,
    tickets,
  });
});

exports.getTicketsFromCard = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({ transaction: req.params.id });
  if (!tickets) new ApiError("Invalid ID or card does not exist");
  res.status(201).json({
    status: "success",
    tickets,
  });
});
