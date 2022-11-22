const Transaction = require("./../models/transaction_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const factoryController = require("./factoryController");

exports.getAllTransactions = factoryController.getAll(Transaction);
exports.getTransaction = factoryController.getOne(Transaction);

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
