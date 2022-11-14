const ApiError = require("../error/ApiError");
const Card = require("./../models/card_model");
const Payment = require("./../models/payment_model");
const Transaction = require("./../models/transaction_model");
// const User = require("./../models/user_model");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");

exports.loadBalance = catchAsync(async (req, res, next) => {
  const { cardID, balance } = req.body;
  const card = await Card.findOne({ uuid: cardID });

  if (!card) {
    next(new ApiError("Card does not exist", 401));
  } else if (balance > process.env.MAX_LOAD_BALANCE) {
    next(new ApiError("Load amount too high, limit Rs.1000", 401));
  }

  if (card && card.balance + balance <= process.env.STD_MAX_BALANCE) {
    card.balance = card.balance + balance;
    await card.save();
    const newTransaction = await Transaction.create({
      card: cardID,
      status: "Closed",
      type: "Load Balance",
    });

    const newPayment = await Payment.create({
      transaction: newTransaction._id,
      amount: balance,
      balanceBefore: card.balance - balance,
      balanceAfter: card.balance,
    });
    res.status(200).json({
      status: "Success",
      message: "Funds sucessfully loaded into the card!",
      data: {
        newTransaction,
        newPayment,
      },
    });
  } else {
    next(
      new ApiError(
        "Adding the current amount will exceed the max amount limit",
        401
      )
    );
  }
});

exports.getAllCards = catchAsync(async (req, res) => {
  const search = req.query.search || "";
  const features = new APIFeatures(
    Card.find({ uuid: { $regex: search, $options: "i" } }),
    req.query
  )
    .filter()
    .sort();
  const cards = await features.query;

  // const cards = await Card.find({ uuid: { $regex: search, $options: "i" } });
  res.status(200).json({
    status: "Success",
    result: cards.length,
    cards,
  });
});

exports.createCard = catchAsync(async (req, res) => {
  const newCard = await Card.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      card: newCard,
    },
  });
});
exports.getCard = catchAsync(async (req, res, next) => {
  const card = await Card.findOne({ uuid: req.params.id });
  if (!card) next(new ApiError("Invalid ID or card does not exist"));
  res.status(201).json({
    status: "success",
    card,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const card = await Card.findOne({ user: req.params.id });
  if (!card) next(new ApiError("Invalid ID or card does not exist"));
  res.status(201).json({
    status: "success",
    card,
  });
});
