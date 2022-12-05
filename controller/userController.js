const User = require("./../models/user_model");
const Card = require("./../models/card_model");
const factoryController = require("./factoryController");

exports.getAllUsers = factoryController.getAll(User);
exports.getUser = factoryController.getOne(User);
exports.updateUser = factoryController.updateOne(User);
exports.deleteUser = factoryController.deleteOne(User);
exports.toggleActive = factoryController.toggleActive(User);
exports.createUser = async (req, res) => {
  try {
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

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Card.findOneAndDelete({ user: req.params.id });
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
