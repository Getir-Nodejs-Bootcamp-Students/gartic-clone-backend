const express = require("express");
const router = express.Router();
const { wordController } = require("../controllers/index");

/* GET users listing. */
router.post("/add", wordController.addWord);
//router.delete("/delete");

module.exports = router;
