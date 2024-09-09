const express = require("express");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

router("/").post(
  signUpController.checkPayloadAuth,
  signUpController.checkIfUsernameExists,
  signUpController.signUpUser
);
