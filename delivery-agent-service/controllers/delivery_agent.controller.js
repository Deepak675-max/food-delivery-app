const DeliveryAgentService = require('../services/delivery_agent.service');

class DeliveryAgentController {
    constructor() {
        this.deliveryAgentService = new DeliveryAgentService();
    }

    createDeliveryAgnet = async (req, res, next) => {
        try {
            const agentDetails = req.body;
            const savedDeliveryAgent = await this.deliveryAgentService.createDeliveryAgent(agentDetails);
            res.status(201).send(savedDeliveryAgent);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    getDeilveryAgents = async (req, res, next) => {
        try {
            const { status } = req.query;
            const deliveryAgents = await this.deliveryAgentService.getDeliveryAgents(status);
            res.status(200).send(deliveryAgents);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = DeliveryAgentController;