const RatingModel = require("../models/rating.model");

class RatingService {
    async addRating(ratingDetails) {
        const newRating = new RatingModel(ratingDetails);
        await newRating.save();
    }
    async getRatings(deliveryAgentId) {
        const ratings = await RatingModel.findAll({
            where: {
                deliveryAgentId: deliveryAgentId,
                isDeleted: false
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "isDeleted"]
            }
        })
        console.log(ratings);
        return ratings
    }
    async SubscribeEvents(payload) {
        const { data, event } = payload;
        switch (event) {
            case 'ADD_DELIVERY_AGENT_RATING':
                await this.addRating(data);
                console.log("Rating added SuccessFully");
                break;
            default:
                break;
        }

    }
}

module.exports = RatingService;