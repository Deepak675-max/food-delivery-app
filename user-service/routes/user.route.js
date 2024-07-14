const express = require('express');

const userRouter = express.Router();

const UserContoller = require('../controllers/user.controller');

const userContoller = new UserContoller();

userRouter.post("/user", userContoller.createUser);

module.exports = userRouter;