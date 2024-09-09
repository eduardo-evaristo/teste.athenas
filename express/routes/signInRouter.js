const express = require("express");
const signInController = require("../controllers/signInController");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

router
  .route("/")
  .post(signUpController.checkPayloadAuth, signInController.logInUser);

router.route("/check").post(signInController.isUserLoggedIn);

module.exports = router;
