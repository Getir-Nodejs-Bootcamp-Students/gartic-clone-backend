const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

/* GET users listing. */
router.post("/sign-up", userController.signUp);
router.post("/sign-in", userController.signIn);

module.exports = router;