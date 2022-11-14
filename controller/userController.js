const User = require("./../models/user_model");
const Card = require("./../models/card_model");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../error/ApiError");
const APIFeatures = require("../utils/apiFeatures");

exports.getAllUsers = catchAsync(async (req, res) => {
  // const page = parseInt(req.query.page) - 1 || 0;
  // const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  console.log(req.query);
  const features = new APIFeatures(
    User.find({ name: { $regex: search, $options: "i" } }),
    req.query
  )
    .filter()
    .sort();

  const users = await features.query;
  res.status(200).json({
    status: "Success",
    result: users.length,
    users,
  });
});

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);

    const newUser = await User.create({
      name: req.body.name,
      address: req.body.address,
      contactNumber: req.body.contactNumber,
      userType: req.body.userType,
      email: req.body.email,
      password: req.body.password,
      cardType: req.body.cardType,
    });
    // ISSUE: CHANGE CARD TYPE BASED ON THE USER
    await Card.create({
      cardType: newUser.cardType,
      user: newUser._id,
    });

    res.status(201).json({
      status: "success",
      newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent!😥",
    });
  }
};

exports.toggleActive = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, [
      { $set: { active: { $not: "$active" } } },
    ]);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch {
    res.status(400).json({
      status: "error",
      message: "No no why send wrong data",
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    console.log(req.params.id);
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch {
    res.status(400).json({
      status: "error",
      message: "No no why send wrong data",
    });
  }
};
