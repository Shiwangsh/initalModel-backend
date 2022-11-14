const router = require("express").Router();
const paymentController = require("../controller/paymentController.js");

router.route("/").get(paymentController.getAllPayments);
router.route("/:id").get(paymentController.getPaymentsFromCard);

module.exports = router;
