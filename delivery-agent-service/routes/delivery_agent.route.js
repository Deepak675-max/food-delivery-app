const express = require('express');

const deliveryAgentRouter = express.Router();

const DeliveryAgentController = require('../controllers/delivery_agent.controller');

const deliveryAgentController = new DeliveryAgentController();

deliveryAgentRouter.post("/delivery-agents", deliveryAgentController.createDeliveryAgnet);
deliveryAgentRouter.get("/delivery-agents", deliveryAgentController.getDeilveryAgents);


module.exports = deliveryAgentRouter;