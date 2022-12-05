const express = require("express");
const router = express.Router({ mergeParams: true });
const transactionController = require("../controller/transactionController.js");
const authController = require("../controller/auth");

router
  .route("/")
  .get(authController.protect, transactionController.getAllTransactions);

// router.route("/day").get(transactionController.getTransactionPerDay);

// router.route("/week").get(transactionController.getTransactionPerWeek);

router.route("/month").get(transactionController.getTransactionPerMonth);
router.route("/today").get(transactionController.getTransactionToday);

router.route("/:id").get(transactionController.getTransaction);
module.exports = router;
