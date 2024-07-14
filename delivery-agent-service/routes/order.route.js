const express = require('express');

const orderRouter = express.Router();

const OrderController = require('../controllers/order.controller');

const orderController = new OrderController();

orderRouter.get("/orders", orderController.getAvailableOrders);
orderRouter.put("/orders", orderController.updateOrderDeliveryStatus);

module.exports = orderRouter;