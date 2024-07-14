const RestaurantService = require('../services/restaurant.service');

class RestaurantController {
    constructor() {
        this.restaurantService = new RestaurantService();
    }
    addRestaurant = async (req, res, next) => {
        try {
            const restaurantData = req.body;
            const savedRestaurant = await this.restaurantService.addRestaurant(restaurantData);
            res.status(201).send(savedRestaurant);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    addMenu = async (req, res, next) => {
        try {
            const menuData = req.body;
            const savedMenu = await this.restaurantService.addMenu(menuData);
            res.status(201).send(savedMenu);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    getRestaurantById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const restaurant = await this.restaurantService.getRestaurantById(id);
            res.status(200).send(restaurant);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    getAllRestaurants = async (req, res, next) => {
        try {
            const { status } = req.query;
            console.log(status);
            const restaurants = await this.restaurantService.getAllRestaurants(status)
            res.status(200).send(restaurants);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    getMenus = async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log(id);
            const menus = await this.restaurantService.getMenus(id)
            res.status(200).send(menus);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    updateMenu = async (req, res, next) => {
        try {
            const { restaurantId, menuId } = req.params;
            const menuData = req.body;
            await this.restaurantService.updateMenu(restaurantId, menuId, menuData);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    updateRestaurantAvailabilityStatus = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await this.restaurantService.updateRestaurantAvailabilityStatus(id, status);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

module.exports = RestaurantController;