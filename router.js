// this files sole job is to list out routes for my application:

const express = require('express');
const router = express.Router()
const userController = require('./controllers/userController');

router.get('/', userController.home);

router.post("/register", userController.register)



module.exports = router;