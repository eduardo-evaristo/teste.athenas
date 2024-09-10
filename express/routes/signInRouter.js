const express = require("express");
const signInController = require("../controllers/signInController");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

//Definição de cada rota
router
  .route("/")
  .post(signUpController.checkPayloadAuth, signInController.logInUser);

router.route("/check").post(signInController.isUserLoggedIn);

module.exports = router;
