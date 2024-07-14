const RatingService = require('../services/rating.service');

class RatingController {
    constructor() {
        this.ratingService = new RatingService();
    }
    addRating = async (req, res, next) => {
        try {
            const ratingDetails = req.body;
            await this.ratingService.addRating(ratingDetails);
            res.status(201).send("Order Rating added Successfully");
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    getRatings = async (req, res, next) => {
        try {
            const { id: deliveryAgentId } = req.params;
            const ratings = await this.ratingService.getRatings(deliveryAgentId);
            res.status(200).send(ratings);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = RatingController;