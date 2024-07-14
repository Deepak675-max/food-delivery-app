const cache = require('../utils/databases/init_redis');
const { default: axios } = require('axios');
const { RESTAURANT_SERVICE_BASE_URL } = require('../config/index');

class RestaurantService {
    async upadteOnlineRestaurantCache(onlineRestaurants) {
        const hour = new Date().getHours();
        const cacheKey = `available-restaurants-${hour}`;
        await cache.set(cacheKey, JSON.stringify(onlineRestaurants));
    }

    async getOnlineRestaurants() {
        const hour = new Date().getHours();
        const cacheKey = `available-restaurants-${hour}`;
        let onlineRestaurants = await cache.get(cacheKey);
        onlineRestaurants = JSON.parse(onlineRestaurants);
        if (!onlineRestaurants) {
            // Fetch from Restaurant Service if not in cache
            const params = {
                status: "Online"
            }
            const response = await axios.get(`${RESTAURANT_SERVICE_BASE_URL}/restaurants`, { params })
            onlineRestaurants = response.data;
            await this.upadteOnlineRestaurantCache(onlineRestaurants);
        }
        return onlineRestaurants;
    }

    async SubscribeEvents(payload) {
        const { data, event } = payload;
        switch (event) {
            case 'UPDATE_ONLINE_RESTAURANTS_CACHE':
                await this.upadteOnlineRestaurantCache(data);
                console.log("Cache Updated SuccessFully");
                break;
            default:
                break;
        }

    }
}

module.exports = RestaurantService;