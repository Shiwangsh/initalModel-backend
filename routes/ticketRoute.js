const router = require("express").Router();
const ticketController = require("../controller/ticketController.js");
const authController = require("../controller/auth.js");

router.use(authController.protect);

router.route("/").get(ticketController.getAllTickets);
router.route("/:id").get(ticketController.getTicketsFromCard);

module.exports = router;
