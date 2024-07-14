const express = require('express');

const ratingRouter = express.Router();

const RatingController = require('../controllers/rating.controller');

const ratingController = new RatingController();

ratingRouter.post('/ratings', ratingController.addRating);

module.exports = ratingRouter;