const router = require("express").Router();
const stopController = require("../controller/stopController.js");
const authController = require("../controller/auth.js");

router.use(authController.protect);

router
  .route("/")
  .get(stopController.getAllStopes)
  .post(stopController.createStop);

router.route("/search").get(stopController.getStopsBySerach);

module.exports = router;
