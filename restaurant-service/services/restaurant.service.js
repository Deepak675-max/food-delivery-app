const MenuItemModel = require('../models/menu.model');
const RestaurantModel = require('../models/restaurant.model');
const httpErrors = require('http-errors');
const { publishMessage } = require('../utils/message_broker/publisher');
const { AVAILABLE_RESTAURANTS_QUEUE } = require('../config/index');

class RestaurantService {
    async addRestaurant(restaurantData) {
        const restaurantInDB = await RestaurantModel.findOne({
            where: {
                name: restaurantData.name,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        });
        if (restaurantInDB)
            throw httpErrors.Conflict(`Restaurant with name: ${restaurantData.name} already exist`);
        const newRestaurant = new RestaurantModel(restaurantData);
        const savedRestaurant = await newRestaurant.save();
        return savedRestaurant;
    }
    async addMenu(menuItem) {
        const restaurant = await RestaurantModel.findOne({
            where: {
                id: menuItem.restaurantId,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        })
        if (!restaurant) {
            throw httpErrors.NotFound(`Invalid Restaurant id`);
        }
        const menuInDB = await MenuItemModel.findOne({
            where: {
                name: menuItem.name,
                restaurantId: menuItem.restaurantId,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        });
        if (menuInDB) {
            throw httpErrors.Conflict(`Menue with name: ${menuItem.name} already exist`);
        }
        const newMenuItem = new MenuItemModel(menuItem);
        const savedMenuItem = await newMenuItem.save();
        return savedMenuItem;
    }
    async getRestaurantById(id) {
        const restaurant = await RestaurantModel.findOne({
            where: {
                id: id,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        })
        if (!restaurant) {
            throw httpErrors.NotFound("invalid restaurant id");
        }
        return restaurant;
    }
    async getAllRestaurants(status) {
        const restaurants = await RestaurantModel.findAll({
            where: {
                status: status,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        })
        return restaurants;
    }

    async getMenus(restaurantId) {
        const menuItems = await MenuItemModel.findAll({
            where: {
                restaurantId: restaurantId,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        })
        return menuItems;
    }

    async updateMenu(retaurantId, itemId, menuItem) {
        const result = await MenuItemModel.update(menuItem, {
            where: {
                id: itemId,
                isDeleted: false
            }
        });
        console.log(result);
    }

    async updateRestaurantAvailabilityStatus(restaurantId, status) {
        const restaurant = await RestaurantModel.findOne(
            {
                where: {
                    id: restaurantId,
                    isDeleted: false
                }
            }
        )
        if (!restaurant) {
            throw httpErrors.NotFound("Restaurant Not found");
        }
        restaurant.status = status;
        await restaurant.save();
        const allOnlineRestaurants = await this.getAllRestaurants("Online");
        await publishMessage('user.restaurant', { data: allOnlineRestaurants, event: "UPDATE_ONLINE_RESTAURANTS_CACHE" });
    }
}
module.exports = RestaurantService;