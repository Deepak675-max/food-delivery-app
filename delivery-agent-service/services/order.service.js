const { default: axios } = require('axios');
const cache = require('../utils/databases/init_redis');
const { RESTAURANT_SERVICE_BASE_URL } = require('../config/index');
const { publishMessage } = require('../utils/message_broker/publisher');
const DeliveryAgentService = require('./delivery_agent.service');

class OrderService {

    async addOrderInCache(orderDetails) {
        const cacheKey = `delivery-agent:${orderDetails.deliveryAgentId}:orders`
        console.log(cacheKey);
        let availableOrders = await cache.get(cacheKey)
        availableOrders = JSON.parse(availableOrders);
        if (!availableOrders) {
            availableOrders = [];
        }
        availableOrders.push(orderDetails);
        console.log(availableOrders);
        await cache.set(cacheKey, JSON.stringify(availableOrders));
    }

    async updateAvailableOrdersCache(deliveryAgentId, availableOrders) {
        const cacheKey = `delivery-agent:${deliveryAgentId}:orders`
        await cache.set(cacheKey, JSON.stringify(availableOrders));
    }

    async getAvailableOrders(deliveryAgentId) {
        const cacheKey = `delivery-agent:${deliveryAgentId}:orders`
        let availableOrders = await cache.get(cacheKey);
        availableOrders = JSON.parse(availableOrders);
        if (!availableOrders) {
            const params = {
                deliveryAgentId: deliveryAgentId
            }
            const response = await axios.get(`${RESTAURANT_SERVICE_BASE_URL}/orders`, { params });
            availableOrders = response.data;
            await this.updateAvailableOrdersCache(deliveryAgentId, availableOrders);
        }
        return availableOrders;
    }

    async updateOrderDeliveryStatus(orderId, status, deliveryAgentId) {
        const availableOrders = await this.getAvailableOrders(deliveryAgentId);
        let userId;
        for (let i = 0; i < availableOrders.length; i++) {
            const order = availableOrders[i];
            if (order.id === orderId) {
                availableOrders[i].orderStatus = status;
                userId = order.userId;
            }
        }
        if (status == "Delivered") {
            const deliveryAgentService = new DeliveryAgentService();
            await deliveryAgentService.updateDeliveryAgentAvailabilityStatus({ deliveryAgentId: deliveryAgentId, status: "Available" });
        }
        await this.updateAvailableOrdersCache(deliveryAgentId, availableOrders);
        await publishMessage('restaurant.orders', { data: { orderId: orderId, orderStatus: status }, event: 'UPDATE_ORDER_STATUS' });
    }

    async SubscribeEvents(payload) {
        const { data, event } = payload;
        console.log("kamboj");
        switch (event) {
            case "UPDATE_ORDERS_CACHE":
                await this.addOrderInCache(data);
                console.log("Cache Updated SuccessFully");
                break;
            default:
                break;
        }

    }

}

module.exports = OrderService;