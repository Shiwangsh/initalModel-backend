const router = require("express").Router();
const transactionController = require("../controller/transactionController.js");

router.route("/").get(transactionController.getAllTransaction);
router.route("/week").get(transactionController.getTransactionPerWeek);
router.route("/month").post(transactionController.getTransactionPerMonth);

router.route("/:id").get(transactionController.getCardFromTransaction);

module.exports = router;
