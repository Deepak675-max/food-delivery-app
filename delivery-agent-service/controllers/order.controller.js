const OrderService = require('../services/order.service');

class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }

    getAvailableOrders = async (req, res, next) => {
        try {
            console.log("request recived");
            const { deliveryAgentId } = req.query;
            const orders = await this.orderService.getAvailableOrders(deliveryAgentId);
            res.status(200).send(orders);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    updateOrderDeliveryStatus = async (req, res, next) => {
        try {
            const { orderId, status, deliveryAgentId } = req.body;
            await this.orderService.updateOrderDeliveryStatus(orderId, status, deliveryAgentId);
            res.status(204).send()
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = OrderController;