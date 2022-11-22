const router = require("express").Router();
const busController = require("../controller/busController.js");
const authController = require("../controller/auth");

router.use(authController.protect);

router.route("/").get(busController.getAllBuses).post(busController.createBus);
router.route("/:id").get(busController.getBus).patch(busController.updateBus);
module.exports = router;
