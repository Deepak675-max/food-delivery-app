const express = require('express');

const orderRouter = express.Router();

const OrderController = require('../controllers/order.controller');

const orderController = new OrderController();

orderRouter.post("/orders", orderController.placeOrder);
orderRouter.get("/orders/:userId", orderController.getOrders);

module.exports = orderRouter;