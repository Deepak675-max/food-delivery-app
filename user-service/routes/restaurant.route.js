const express = require('express');

const restaurantRouter = express.Router();

const RestaurantController = require('../controllers/restaurant.controller');

const restaurantController = new RestaurantController();

restaurantRouter.get("/restaurants", restaurantController.getOnlineRestaurants);

module.exports = restaurantRouter;