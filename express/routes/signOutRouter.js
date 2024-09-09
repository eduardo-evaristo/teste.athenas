const express = require("express");
const signOutController = require("./../controllers/signOutController");

const router = express.Router();

router.route("/").post(signOutController.signUserOut);
