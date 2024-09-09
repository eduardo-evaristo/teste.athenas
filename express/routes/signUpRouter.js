const express = require("express");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

router
  .route("/")
  .post(
    signUpController.checkPayloadAuth,
    signUpController.checkIfUsernameExists,
    signUpController.signUpUser
  );

module.exports = router;
