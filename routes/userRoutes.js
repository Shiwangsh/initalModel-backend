const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/auth");

router
  .route("/")
  .get(authController.protect, userController.getAllUsers)
  .post(authController.protect, userController.createUser);

router.route("/:id/active").patch(userController.toggleActive);

router
  .route("/:id")
  .get(authController.protect, userController.getUser)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = router;
