const OrderService = require('../services/order.service');

class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }

    placeOrder = async (req, res, next) => {
        try {
            console.log(req.body);
            const orderDetails = req.body;
            await this.orderService.placeOrder(orderDetails);
            res.status(201).send("order created successfully");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    getOrders = async (req, res, next) => {
        try {
            const { userId } = req.params;
            console.log(userId);
            const orders = await this.orderService.getOrders(userId);
            res.status(200).send(orders);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = OrderController;