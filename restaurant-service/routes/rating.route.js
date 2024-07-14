const express = require('express');

const ratingRouter = express.Router();

const RatingController = require('../controllers/rating.controller');

const ratingController = new RatingController();

ratingRouter.post('/orders/ratings', ratingController.addRating);
ratingRouter.get('/orders/:id/ratings', ratingController.getRatings);

module.exports = ratingRouter;