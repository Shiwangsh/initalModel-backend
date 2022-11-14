const router = require("express").Router();
const ticketController = require("../controller/ticketController.js");

router.route("/").get(ticketController.getAllTickets);
router.route("/:id").get(ticketController.getTicketsFromCard);

module.exports = router;
