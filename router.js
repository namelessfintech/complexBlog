// this files sole job is to list out routes for my application:

const express = require('express');
const router = express.Router()
const userController = require('./controllers/userController');
const aboutController = require('./controllers/aboutController');

router.get('/', userController.home);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/about", aboutController.info);

module.exports = router;