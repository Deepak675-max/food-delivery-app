const httpErrors = require('http-errors');
const bcrypt = require('bcrypt');
const { publishMessage } = require('../utils/message_broker/publisher');
const DeliveryAgentModel = require('../models/delivery_agent.model');

class DeliveryAgentService {

    async createDeliveryAgent(agentDetails) {
        const deliveryAgentInDB = await DeliveryAgentModel.findOne({
            where: {
                email: agentDetails.email,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        });
        if (deliveryAgentInDB) {
            throw httpErrors.Conflict(`Delivery Agent with email: ${agentDetails.email} already exist`);
        }
        agentDetails.password = await bcrypt.hash(agentDetails.password, 10);
        const newDeliveryAgent = new DeliveryAgentModel(agentDetails);
        return await newDeliveryAgent.save();
    }

    async getDeliveryAgents(status) {
        const deliveryAgents = await DeliveryAgentModel.findAll({
            where: {
                status: status,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        })
        return deliveryAgents;
    }

    async updateDeliveryAgentAvailabilityStatus(deliveryAgentDetails) {
        const deliveryAgentInDB = await DeliveryAgentModel.findOne({
            where: {
                id: deliveryAgentDetails.deliveryAgentId,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        });
        if (!deliveryAgentInDB) {
            throw httpErrors.NotFound('Delivery agent not found');
        }
        deliveryAgentInDB.status = deliveryAgentDetails.status;
        await deliveryAgentInDB.save();
    }

    async SubscribeEvents(payload) {
        console.log("bahanchod");
        const { data, event } = payload;
        switch (event) {
            case 'UPDATE_DELIVERY_AGENT_AVAILABILITY_STATUS':
                await this.updateDeliveryAgentAvailabilityStatus(data);
                console.log("Cache Updated SuccessFully");
                break;
            default:
                break;
        }

    }

}
module.exports = DeliveryAgentService;