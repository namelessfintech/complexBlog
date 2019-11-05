// this files sole job is to list out routes for my application:

const express = require('express');
const router = express.Router()
const userController = require('./controllers/userController');
const aboutController = require('./controllers/aboutController');
const postController = require('./controllers/postController');

// user routes
router.get('/', userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout",userController.logout)
router.get("/about", aboutController.info);

// post routes
router.get("/create-post", userController.loggedIn, postController.viewCreateForm )

router.post("/create-post", userController.loggedIn, postController.create)

module.exports = router;