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
}

module.exports = RatingController;