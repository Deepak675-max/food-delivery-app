const RatingModel = require('./rating.model');
const DeliveryAgentModel = require('./delivery_agent.model');


//one-to-many asociation between Delivery Agent and Ratings
DeliveryAgentModel.hasMany(RatingModel, { foreignKey: "deliveryAgentId", onDelete: 'CASCADE' });
RatingModel.belongsTo(DeliveryAgentModel, { foreignKey: "deliveryAgentId", onDelete: 'CASCADE' });

