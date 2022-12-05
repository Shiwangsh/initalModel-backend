const express = require("express");
const router = express.Router();
const cardController = require("../controller/cardController");
const authController = require("../controller/auth");
const transactionRouter = require("./transactionRoute");

router.use("/:cardId/transactions", transactionRouter);

router.route("/tap").post(cardController.tap);

router.use(authController.protect);

router
  .route("/")
  .get(cardController.getAllCards)
  .post(cardController.createCard);

router.route("/:id").get(cardController.getCard);
router.post("/firstTap", authController.initialTap);
router.post("/secondTap", authController.finalTap);

router.post("/loadBalance", cardController.loadBalance);
router.get("/user/:userId", cardController.getCardFromUser);
module.exports = router;
