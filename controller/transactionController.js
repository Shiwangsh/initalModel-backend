const Transaction = require("./../models/transaction_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllTransaction = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) - 1 || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || " ";

  const features = new APIFeatures(Transaction.find(), req.query)
    .filter()
    .sort();
  const transactions = await features.query;

  res.status(200).json({
    status: "Success",
    result: transactions.length,
    transactions,
  });
});

exports.getCardFromTransaction = catchAsync(async (req, res, next) => {
  console.log(req.params);
  const transaction = await Transaction.find({ card: req.params.id }).sort(
    "-createdAt"
  );
  if (!transaction) new ApiError("Invalid card or transaction does not exist");
  res.status(201).json({
    status: "success",
    transaction,
  });
});

exports.getTransactionPerWeek = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    // ? get count of data for each day
    // ? [asdasdasda,sd,as,das,d,asd,as] = >

    const countStatsArray = [];

    for (let i = 0; i <= 6; i++) {
      const fileteredTtransanctions = transactions.filter((transaction) => {
        dataMonth = new Date(transaction.createdAt).getMonth();
        dataDay = new Date(transaction.createdAt).getDay();
        requestedMonth = 10;
        return dataMonth == requestedMonth && dataDay == i;
      });
      countStatsArray.push(fileteredTtransanctions.length);
    }

    res.status(200).json({
      status: "success",
      countStatsArray,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTransactionPerMonth = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const countStatsArray = [];

    const fileteredTtransanctions = transactions.filter((transaction) => {
      dataMonth = new Date(transaction.createdAt).getMonth();
      requestedMonth = req.body.month;
      return dataMonth == requestedMonth;
    });
    countStatsArray.push(fileteredTtransanctions.length);
    res.status(200).json({
      status: "success",
      countStatsArray,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};
