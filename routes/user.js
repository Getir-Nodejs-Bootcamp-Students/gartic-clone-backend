var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

/* GET users listing. */
router.post('/sign-up', userController.signUp);
router.post('/sign-in', userController.signIn);
router.post('/sign-out', userController.signOut);

module.exports = router;
