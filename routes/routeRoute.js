const router = require("express").Router();
const Route = require("../models/route_model");
const routeController = require("../controller/routeController.js");

router
  .route("/")
  .get(routeController.getAllRoutes)
  .post(routeController.createRoute);

router.get("/:id", routeController.getRoute);

module.exports = router;
