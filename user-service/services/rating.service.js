const { default: axios } = require("axios");
const { publishMessage } = require("../utils/message_broker/publisher");

class RatingService {
    async addRating(ratingDetails) {
        if (ratingDetails.orderId) {
            await publishMessage('restaurant.ratings', { data: ratingDetails, event: "ADD_ORDER_RATING" });
        }
        else {
            console.log("deepak kamboj");
            await publishMessage('delivery_agent.ratings', { data: ratingDetails, event: "ADD_DELIVERY_AGENT_RATING" });
        }

    }
}

module.exports = RatingService;