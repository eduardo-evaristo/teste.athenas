const express = require("express");
const signOutController = require("./../controllers/signOutController");

const router = express.Router();

//Definição da rota
router.route("/").post(signOutController.signUserOut);

module.exports = router;
