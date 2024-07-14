const { publishMessage } = require('../utils/message_broker/publisher');
const { DELIVERY_AGENT_SERVICE_BASE_URL } = require('../config/index');
const cache = require('../utils/databases/init_redis')
const { default: axios } = require('axios');
const OrderService = require('./order.service');
const httpErrors = require('http-errors');

class DeliveryAgentService {

    constructor() {
        this.orderService = new OrderService();
    }

    async updateAvailableDeliveryAgentsCache(availableDeliveryAgents) {
        const cacheKey = "avialable_delivery_agents"
        await cache.set(cacheKey, JSON.stringify(availableDeliveryAgents));
    }

    async getAvailableDeliverAgents() {
        try {
            const cacheKey = "avialable_delivery_agents"
            let availableDeliveryAgents = await cache.get(cacheKey);
            if (!availableDeliveryAgents) {
                availableDeliveryAgents = []
            } else {
                availableDeliveryAgents = JSON.parse(availableDeliveryAgents);
            }
            if (availableDeliveryAgents?.length == 0) {
                const params = {
                    status: "Available"
                }
                const response = await axios.get(`${DELIVERY_AGENT_SERVICE_BASE_URL}/delivery-agents`, { params })
                availableDeliveryAgents = response.data;
                await this.updateAvailableDeliveryAgentsCache(availableDeliveryAgents);
            }
            return availableDeliveryAgents;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async assignDeliveryAgent(orderId) {
        try {
            // const orderService = new OrderService();
            const orderInDB = await this.orderService.getOrderById(orderId);
            if (orderInDB.deliveryAgentId) {
                throw httpErrors.Conflict('Delivery Agent already assigned to this order');
            }
            const availableDeliveryAgents = await this.getAvailableDeliverAgents();
            if (availableDeliveryAgents?.length == 0) {
                throw httpErrors.NotFound('Delivery Agent is not available right now');
            }
            const deliveryAgent = availableDeliveryAgents[0];
            availableDeliveryAgents.splice(0, 1);
            orderInDB.deliveryAgentId = deliveryAgent.id;
            orderInDB.orderStatus = "Ready for Pickup";
            await orderInDB.save();
            await this.updateAvailableDeliveryAgentsCache(availableDeliveryAgents);
            await publishMessage('delivery_agent.orders', { data: orderInDB, event: "UPDATE_ORDERS_CACHE" });
            await publishMessage('delivery_agent.agents', { data: { deliveryAgentId: orderInDB.deliveryAgentId, status: "Busy" }, event: "UPDATE_DELIVERY_AGENT_AVAILABILITY_STATUS" });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}
module.exports = DeliveryAgentService;