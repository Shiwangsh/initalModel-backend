const ApiError = require("../error/ApiError");
const Card = require("./../models/card_model");
const Payment = require("./../models/payment_model");
const Ticket = require("./../models/ticket_model");
const Transaction = require("./../models/transaction_model");
const Bus = require("./../models/bus_model");
const catchAsync = require("../utils/catchAsync");
const factoryController = require("./factoryController");

exports.getAllCards = factoryController.getAll(Card);
exports.createCard = factoryController.createOne(Card);

exports.getCard = catchAsync(async (req, res, next) => {
  const card = await Card.findOne({ uuid: req.params.id });
  if (!card) next(new ApiError("Invalid ID or card does not exist"));
  res.status(201).json({
    status: "success",
    card,
  });
});

exports.getCardFromUser = catchAsync(async (req, res, next) => {
  const card = await Card.findOne({ user: req.params.userId });
  if (!card) next(new ApiError("Invalid ID or card does not exist"));
  res.status(201).json({
    status: "success",
    card,
  });
});

exports.loadBalance = catchAsync(async (req, res, next) => {
  const { cardID, balance } = req.body;
  const card = await Card.findOne({ uuid: cardID });

  if (!card) {
    throw new ApiError("Card does not exist", 401);
  } else if (balance > process.env.MAX_LOAD_BALANCE) {
    throw new ApiError("Load amount too high, limit Rs.1000", 401);
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
    throw new ApiError(
      "Adding the current amount will exceed the max amount limit",
      401
    );
  }
});

exports.tap = catchAsync(async (req, res) => {
  const { cardID, busID, firstStop, lastStop } = req.body;
  const card = await Card.findOne({
    uuid: cardID,
  }).populate("user");
  const bus = await Bus.findById(busID).populate("route");
  if (!card) throw new ApiError("Invalid card", 401);
  if (!bus) throw new ApiError("Bus is invalid", 401);
  const route = bus.route;
  cardCheck(card);
  //Search open ticket Transaction
  const transaction = await Transaction.findOne({
    card: cardID,
    status: "Open",
    type: "Ticket",
  });
  if (transaction) {
    const transactionTime = transaction.createdAt.getTime();
    const expiryTime = transactionTime + 1 * 60 * 1000;
    const currentTime = new Date().getTime();
    console.log("Current Time->", currentTime);
    console.log("Created Time->", transactionTime, "Expiry Time->", expiryTime);
    currentTime > expiryTime
      ? deductMax(transaction, card).then(() => {
          createTransaction(cardID, route.routeName, firstStop).then(
            (response) => {
              res.status(200).json({
                status:
                  "Success! Travel started with max amount decuted for previous travel because you forgot to tap on your exit dummy and created a new Transaction🚋💸✅🚋✅",
                data: {
                  transaction: response.newTransaction,
                  ticket: response.newTicket,
                },
              });
            }
          );
        })
      : editTransaction(card, route, transaction, firstStop, lastStop).then(
          (response) => {
            res.status(200).json({
              status: "Success! Travel Ended🚋💸✅",
              data: {
                transaction: response.transaction,
                ticket: response.ticket,
              },
            });
          }
        );
  } else {
    createTransaction(cardID, route.routeName, firstStop).then((response) => {
      res.status(200).json({
        status: "Success! Travel started🚋✅",
        data: {
          transaction: response.newTransaction,
          ticket: response.newTicket,
        },
      });
    });
  }
});

const cardCheck = (card) => {
  if (!card.user.active === true) throw new ApiError("Card is inactive", 500);
  if (card.balance < process.env.STD_MIN_BALANCE) {
    throw new ApiError("Insufficient Balance", 500);
  }
  return;
};

// const cardTypeCheck = (card) => {};

const deductMax = async (transaction, card) => {
  card.balance = card.balance - process.env.MAX_BALANCE_DEDUCT;
  card.save();
  transaction.status = "Closed";
  transaction.save();
  // update Ticket
  const ticket = await Ticket.findOne(
    { transaction: transaction._id }
    // {
    //   amount: process.env.MAX_BALANCE_DEDUCT,
    //   lastStop: null,
    // }
  );
  ticket.amount = process.env.MAX_BALANCE_DEDUCT;
  ticket.lastStop = null;
  ticket.save();
  return { ticket, transaction };
};

const editTransaction = async (
  card,
  route,
  transaction,
  firstStop,
  lastStop
) => {
  const userRoute = route.stops.filter(function (stop) {
    if (firstStop < lastStop) {
      return stop.number >= firstStop && stop.number < lastStop;
    }
    return stop.number < firstStop && stop.number >= lastStop;
  });
  console.log("UserROUTEE=", route.stops);

  const totalDistance = userRoute
    .map((item) => item.distance)
    .reduce((prev, curr) => prev + curr, 0);
  // console.log(totalDistance);
  let amount = (totalDistance / 1000) * process.env.STD_FARE_PER_KM;

  if (card.cardType === "Student") {
    amount = amount - amount * 0.1;
  } else if (card.cardType === "Senior") {
    amount = amount - amount * 0.15;
  }

  card.balance = card.balance - amount;
  card.save();

  transaction.status = "Closed";
  transaction.save();

  // update Ticket
  const ticket = await Ticket.findOne(
    { transaction: transaction._id }
    // {
    //   amount: amount,
    //   lastStop: lastStop,
    // }
  );
  ticket.amount = amount;
  ticket.lastStop = lastStop;
  ticket.save();
  return { ticket, transaction };
};

const createTransaction = async (cardID, routeName, firstStop) => {
  const newTransaction = await Transaction.create({
    card: cardID,
    status: "Open",
    type: "Ticket",
  });
  const newTicket = await Ticket.create({
    routeName: routeName,
    firstStop: firstStop,
    transaction: newTransaction._id,
  });
  return { newTransaction, newTicket };
};
