const express = require("express");
const router = express.Router();
const staffController = require("../controller/staffController");
const authController = require("../controller/auth");

router.post("/login", authController.login);

router.use(authController.protect);

router
  .route("/")
  .get(staffController.getAllStaffs)
  .post(staffController.createStaff);

router
  .route("/:id")
  .get(staffController.getStaff)
  .patch(staffController.updateStaff)
  .delete(staffController.deleteStaff);

router.route("/:id/active").patch(staffController.toggleActive);
module.exports = router;
