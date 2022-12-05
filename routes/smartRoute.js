const router = require("express").Router();
const smartController = require("../controller/smartRouteTest");
// const authController = require("../controller/auth.js");

// router.use(authController.protect);

router.route("/").get(smartController.getAllRoutes);
router.route("/").post(smartController.getSpecificRoute);

module.exports = router;
