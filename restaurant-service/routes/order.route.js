const express = require('express');

const orderRouter = express.Router();

const OrderController = require('../controllers/order.controller');

const orderController = new OrderController();

orderRouter.post("/orders", orderController.createOrder);
orderRouter.get("/orders", orderController.getOrders);
orderRouter.get("/orders/:id", orderController.getOrderById);
orderRouter.put("/orders", orderController.updateOrder);



module.exports = orderRouter;