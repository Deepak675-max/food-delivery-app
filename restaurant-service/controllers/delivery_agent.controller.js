const DeliveryAgentService = require('../services/delivery_agent.service');

class DeliveryAgentController {
    constructor() {
        this.deliveryAgentService = new DeliveryAgentService();
    }
    assignDeliveryAgent = async (req, res, next) => {
        try {
            const { orderId } = req.body;
            await this.deliveryAgentService.assignDeliveryAgent(orderId);
            res.status(204).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

}

module.exports = DeliveryAgentController;