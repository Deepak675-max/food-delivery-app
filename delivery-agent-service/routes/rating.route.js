const express = require('express');

const ratingRouter = express.Router();

const RatingController = require('../controllers/rating.controller');

const ratingController = new RatingController();

ratingRouter.post('/delivery-agents/ratings', ratingController.addRating);
ratingRouter.get('/delivery-agents/:id/ratings', ratingController.getRatings);

module.exports = ratingRouter;