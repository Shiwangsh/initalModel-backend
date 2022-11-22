const express = require("express");
const router = express.Router({ mergeParams: true });
const transactionController = require("../controller/transactionController.js");
const authController = require("../controller/auth");

router
  .route("/")
  .get(authController.protect, transactionController.getAllTransactions);
// router.route("/week").get(transactionController.getTransactionPerWeek);
// router.route("/month").post(transactionController.getTransactionPerMonth);

router.route("/:id").get(transactionController.getTransaction);
module.exports = router;
