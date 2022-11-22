const router = require("express").Router();
const paymentController = require("../controller/paymentController.js");
const authController = require("../controller/auth.js");

router.use(authController.protect);

router.route("/").get(paymentController.getAllPayments);
router.route("/:id").get(paymentController.getPaymentsFromCard);

module.exports = router;
