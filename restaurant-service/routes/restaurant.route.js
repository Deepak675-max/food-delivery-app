const express = require('express');

const restaurantRouter = express.Router();

const RestaurantController = require('../controllers/restaurant.controller');

const restaurantController = new RestaurantController();

restaurantRouter.post("/restaurants", restaurantController.addRestaurant);
restaurantRouter.post("/restaurants/menu", restaurantController.addMenu);
restaurantRouter.get("/restaurants/:id/menu", restaurantController.getMenus);
restaurantRouter.put("/restaurants/:restaurantId/menu/:menuId", restaurantController.updateMenu);
restaurantRouter.get("/restaurants/:id", restaurantController.getRestaurantById);
restaurantRouter.put("/restaurants/:id", restaurantController.updateRestaurantAvailabilityStatus);
restaurantRouter.get("/restaurants", restaurantController.getAllRestaurants);


// restaurantRouter.get("/restaurent", restaurantController.createUser);


module.exports = restaurantRouter;