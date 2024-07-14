const RestaurantService = require('../services/restaurant.service');

class RestaurantController {
    constructor() {
        this.restaurantService = new RestaurantService();
        console.log("object created!!");
    }
    getOnlineRestaurants = async (req, res, next) => {
        try {
            let availableRestaurants = await this.restaurantService.getOnlineRestaurants();
            res.status(200).send(availableRestaurants);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = RestaurantController;