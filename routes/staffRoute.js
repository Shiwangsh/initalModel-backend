const express = require("express");
const router = express.Router();
const staffController = require("../controller/staffController");
const authController = require("../controller/auth");

router
  .route("/")
  .get(authController.protect, staffController.getAllStaffs)
  .post(authController.protect, staffController.createStaff);

router
  .route("/:id")
  .get(authController.protect, staffController.getStaff)
  .patch(authController.protect, staffController.updateStaff)
  .delete(authController.protect, staffController.deleteStaff);

router.post("/login", authController.login);

module.exports = router;
