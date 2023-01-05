const router = require("express").Router();
const smartController = require("../controller/smartRoute");
// const authController = require("../controller/auth.js");

// router.use(authController.protect);

router.route("/").post(smartController.getSpecificRoute);

module.exports = router;
