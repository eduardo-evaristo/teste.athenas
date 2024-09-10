const express = require("express");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

//Definição de cada rota
router
  .route("/")
  .post(
    signUpController.checkPayloadAuth,
    signUpController.checkIfUsernameExists,
    signUpController.signUpUser
  );

module.exports = router;
