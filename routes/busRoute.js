const router = require("express").Router();
const Route = require("../models/route_model");
const busController = require("../controller/busController.js");
const authController = require("../controller/auth");

router.route("/").get(busController.getBuses).post(busController.createBus);
router
  .route("/")
  .get(busController.getAllRoutes)
  .post(busController.createRoute);

router.route("/").patch(authController.protect, busController.updateBus);

router.get("/route/:id", busController.getBusRoute);
module.exports = router;
