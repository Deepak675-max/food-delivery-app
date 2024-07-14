const cache = require('../utils/databases/init_redis');
const { default: axios } = require('axios');
const { RESTAURANT_SERVICE_BASE_URL } = require('../config/index');
const httpErrors = require('http-errors');

class OrderService {
    async placeOrder(orderDetails) {
        try {
            const requestBody = {
                ...orderDetails
            }
            const response = await axios.post(`${RESTAURANT_SERVICE_BASE_URL}/orders`, requestBody)
                .catch(error => {
                    return error.response;
                });
            if (response.status !== 201) {
                throw response.data.error;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async updateUserOrderCache(userId, userOrders) {
        const cacheKey = `user:${userId}:orders`;
        await cache.set(cacheKey, JSON.stringify(userOrders));
    }

    async getOrders(userId) {
        const cacheKey = `user:${userId}:orders`;
        let userOrders = await cache.get(cacheKey);
        if (!userOrders) {
            userOrders = [];
        } else {
            userOrders = JSON.parse(userOrders);
        }
        if (userOrders?.length === 0) {
            const params = {
                userId: userId
            }
            const response = await axios.get(`${RESTAURANT_SERVICE_BASE_URL}/orders`, { params })
                .catch(error => {
                    return error.response;
                })
            if (response.status != 200) {
                throw response.data.error;
            }
            userOrders = response.data;
            await this.updateUserOrderCache(userId, userOrders);
        }
        return userOrders;
    }

    async SubscribeEvents(payload) {
        const { data, event } = payload;
        switch (event) {
            case 'UPDATE_USER_ORDERS_CACHE':
                await this.updateUserOrderCache(data.userId, data.orders);
                console.log("User Order Cache Updated SuccessFully");
                break;
            default:
                break;
        }

    }
}

module.exports = OrderService;