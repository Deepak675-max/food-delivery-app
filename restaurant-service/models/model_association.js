const RestaurantModel = require('./restaurant.model');
const MenuItemsModel = require('./menu.model');
const OrderModel = require('./order.model');
const OrderItemsModel = require('./order_item.model');
const RatingModel = require('./rating.model');


//one-to-many association between Restaurant and MenuItem.
RestaurantModel.hasMany(MenuItemsModel, { foreignKey: "restaurantId" });
MenuItemsModel.belongsTo(RestaurantModel, { foreignKey: "restaurantId" });


//one-to-many association between Order and OrderItem.
OrderModel.hasMany(OrderItemsModel, { foreignKey: "orderId", onDelete: 'CASCADE' });
OrderItemsModel.belongsTo(OrderModel, { foreignKey: "orderId", onDelete: 'CASCADE' });


//one-to-many association between Restaurant and Order.
RestaurantModel.hasMany(OrderModel, { foreignKey: "restaurantId" });
OrderModel.belongsTo(RestaurantModel, { foreignKey: "restaurantId" });

//one-to-many association between Order and Order Rating.
OrderModel.hasMany(RatingModel, { foreignKey: "orderId", onDelete: 'CASCADE' });
RatingModel.belongsTo(OrderModel, { foreignKey: "orderId", onDelete: 'CASCADE' });

