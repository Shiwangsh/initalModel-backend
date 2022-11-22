const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const authController = require("../controller/auth");

router.use(authController.protect);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route("/:id/active").patch(userController.toggleActive);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
