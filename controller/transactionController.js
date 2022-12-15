const Transaction = require("./../models/transaction_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const factoryController = require("./factoryController");

exports.getAllTransactions = factoryController.getAll(Transaction);
// exports.getTransaction = factoryController.getOne(Transaction, {
//   path: "ticket",
//   path: "payment",
// });

exports.getTransaction = catchAsync(async (req, res, next) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate("ticket")
    .populate("payment");
  res.status(200).json({
    status: "success",
    data: {
      transaction,
    },
  });
});

exports.getCardFromTransaction = catchAsync(async (req, res, next) => {
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

exports.getTransactionPerDay = async (req, res) => {
  try {
    // ? get count of data for each day
    // ? [22,40,50,78....] = >

    const month = 9;
    const year = 2022;
    const fromDate = new Date(year, month, 1);
    const toDate = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0);

    const condition = { createdAt: { $gte: fromDate, $lte: toDate } };

    Transaction.find(condition, function (err, docs) {
      console.log(docs); //prints empty arry []
    });

    res.status(200).json({
      status: "success",
      // countStatsArray,
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
    // ? get count of data for each day
    // ? [22,40,50,78....] = >

    const condition = {
      createdAt: { $gte: new Date(2022, 0, 1), $lte: new Date(2022, 12, 1) },
    };

    const transactions = await Transaction.find(condition);

    const countStatsArray = [];

    for (i = 0; i < 12; i++) {
      const fileteredTtransanctions = transactions.filter((transaction) => {
        dataMonth = new Date(transaction.createdAt).getMonth();
        return dataMonth == i;
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

exports.getTransactionToday = async (req, res) => {
  const today = new Date().toISOString().substring(0, 10).replace(" ", " ");
  // console.log(new Date(today));
  const transactions = await Transaction.find({
    createdAt: { $gte: new Date(today) },
  });

  res.status(200).json({
    status: "success",
    result: transactions.length,
    transactions,
  });
};
