const Bus = require("./../models/bus_model");
const factoryController = require("./factoryController");

exports.getAllBuses = factoryController.getAll(Bus);
exports.getBus = factoryController.getOne(Bus, { path: "route" });
exports.createBus = factoryController.createOne(Bus);
exports.updateBus = factoryController.updateOne(Bus);
