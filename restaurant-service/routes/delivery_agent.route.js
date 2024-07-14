const express = require('express');

const deliveryAgentRouter = express.Router();

const DeliveryAgentController = require('../controllers/delivery_agent.controller');

const deliveryAgentController = new DeliveryAgentController();

deliveryAgentRouter.put("/delivery-agents/assign", deliveryAgentController.assignDeliveryAgent);

module.exports = deliveryAgentRouter;