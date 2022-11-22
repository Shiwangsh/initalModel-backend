const ApiError = require("../error/ApiError");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const Staff = require("./../models/staff_model");
const User = require("./../models/user_model");
const Card = require("./../models/card_model");
const Ticket = require("./../models/ticket_model");
const Transaction = require("./../models/transaction_model");
const Route = require("../models/route_model");
const catchAsync = require("../utils/catchAsync");

// const getDistanceFromLatLonInKm = ([lon1, lat1], [lon2, lat2]) => {
//   function deg2rad(deg) {
//     return deg * (Math.PI / 180);
//   }
//   let R = 6371; // Radius of the earth in km
//   let dLat = deg2rad(lat2 - lat1); // deg2rad below
//   let dLon = deg2rad(lon2 - lon1);
//   let a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   let d = R * c; // Distance in km
//   return +d.toFixed(2);
// };

exports.initialTap = catchAsync(async (req, res, next) => {
  const { cardID } = req.body;

  const card = await Card.findOne({
    uuid: cardID,
  }).populate("user");
  if (!card) {
    return next(new ApiError("Invalid card", 500));
  }
  if (!card.user.active === true)
    return next(new ApiError("Card is inactive", 500));
  if (card.balance < process.env.STD_MIN_BALANCE) {
    return next(new ApiError("Insufficient Balance", 500));
  }
  const transaction = await Transaction.findOne({
    card: cardID,
    status: "Open",
  });
  if (transaction) {
    next(new ApiError("Card already has a active status😥", 500));
  } else {
    const newTransaction = await Transaction.create({
      card: cardID,
      status: "Open",
      type: "Ticket",
    });

    res.status(200).json({
      status: "success 🚋",
      newTransaction,
    });
  }
});

exports.finalTap = catchAsync(async (req, res, next) => {
  const { cardID, routeID, firstStop, lastStop } = req.body;
  /*
   * Query the database to find the distance between the initial and final stop
   * add the distance together
   */
  const route = await Route.findById(routeID);
  const card = await Card.findOne({ uuid: cardID });

  if (!card) next(new ApiError("Card is invalid", 401));
  if (!route) next(new ApiError("Route is invalid", 401));
  const transaction = await Transaction.findOne({
    card: cardID,
    status: "Open",
    type: "Ticket",
  });
  if (!transaction) {
    next(new ApiError("The card does not have any open COMMUTE transactions"));
  }

  const userRoute = route.stops.filter(function (stop) {
    if (firstStop < lastStop) {
      return stop.number >= firstStop && stop.number < lastStop;
    }
    return stop.number < firstStop && stop.number >= lastStop;
  });
  console.log(userRoute);

  const totalDistance = userRoute
    .map((item) => item.distance)
    .reduce((prev, curr) => prev + curr, 0);
  console.log(totalDistance);

  // Calculate amount
  const amount = (totalDistance / 1000) * process.env.STD_FARE_PER_KM;

  // Deduct amount
  card.balance = card.balance - amount;
  card.save();

  transaction.status = "Closed";
  transaction.save();

  // Create Ticket
  const newTicket = await Ticket.create({
    amount: amount,
    routeName: route.routeName,
    firstStop: firstStop,
    lastStop: lastStop,
    transaction: transaction._id,
  });
  res.status(200).json({
    status: "success 🚋💸",
    data: {
      userRoute,
      card,
      transaction,
      newTicket,
    },
  });
});

/* 
*
LOGIN
*
*/

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
    // expiresIn: 20,
  });
};

const createToken = (user, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);
  res.status(200).json({
    status: "Success",
    token,
    data: {
      user,
    },
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //   1) Check if email and password exist
  if (!email || !password) {
    return next(new ApiError("Please fill all the fields", 400));
  }
  // 2) Check if user exists and password is correct
  const user = await Staff.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new ApiError("Incorrect email or password", 400));
  }
  // 3) If everything ok, send token to client
  createToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's true
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    {
      return next(
        new ApiError("You are not loggied in! Please log in to get access", 401)
      );
    }
  }

  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) Check if user still exists
  const currentUser = await Staff.findById(decoded.id);
  if (!currentUser) return next(new ApiError("User no longer exist", 401));

  //Grant access to protected route
  req.user = currentUser;
  next();
});
