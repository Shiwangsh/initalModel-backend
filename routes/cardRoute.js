const express = require("express");
const router = express.Router();

const cardController = require("../controller/cardController");
const authController = require("../controller/auth");

router
  .route("/")
  .get(cardController.getAllCards)
  .post(cardController.createCard);

router.route("/:id").get(cardController.getCard);

router.route("/user/:id").get(cardController.getUser);

router.post("/firstTap", authController.initialTap);
router.post("/secondTap", authController.finalTap);

router.post("/loadBalance", cardController.loadBalance);
module.exports = router;
