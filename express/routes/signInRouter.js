const express = require("express");
const signInController = require("../controllers/signInController");
const signUpController = require("./../controllers/signUpController");

const router = express.Router();

router("/").post(signUpController.checkPayloadAuth, signInController.logInUser);
