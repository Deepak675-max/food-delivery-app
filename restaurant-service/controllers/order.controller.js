const OrderService = require('../services/order.service');

class OrderController {
    constructor() {
        this.orderService = new OrderService();
    }
    createOrder = async (req, res, next) => {
        try {
            const orderDetails = req.body;
            await this.orderService.createOrder(orderDetails);
            res.status(201).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    getOrderById = async (req, res, next) => {
        try {
            const { id: orderId } = req.params;
            const order = await this.orderService.getOrderById(orderId)
            res.status(200).send(order);
        } catch (error) {

        }
    }

    getOrders = async (req, res, next) => {
        try {
            const queryData = req.query;
            let condition;
            if (queryData.userId) {
                condition = {
                    userId: queryData.userId,
                    isDeleted: false
                }
            } else if (queryData.restaurantId) {
                condition = {
                    restaurantId: queryData.restaurantId,
                    isDeleted: false
                }
            }
            else if (queryData.deliveryAgentId) {
                condition = {
                    deliveryAgentId: queryData.deliveryAgentId,
                    isDeleted: false
                }
            }
            else {
                condition = {
                    isDeleted: false
                }
            }
            const orders = await this.orderService.getOrders(condition);
            console.log(orders);
            res.status(200).send(orders);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    updateOrder = async (req, res, next) => {
        try {
            const orderData = req.body;
            await this.orderService.updateOrder(orderData);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = OrderController;