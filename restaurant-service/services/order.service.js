const MenuItemsModel = require('../models/menu.model');
const RestaurantModel = require('../models/restaurant.model');
const OrderModel = require('../models/order.model');
const OrderItemsModel = require('../models/order_item.model');
const httpErrors = require('http-errors');
const { publishMessage } = require('../utils/message_broker/publisher');
const sequelize = require('../utils/databases/init_postgres');
const OrderItemModel = require('../models/order_item.model');

class OrderService {

    async createOrder(orderDetails) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const restaurantInDB = await RestaurantModel.findOne({
                where: {
                    id: orderDetails.restaurantId,
                    isDeleted: false
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt', "isDeleted"]
                }
            })
            if (!restaurantInDB) {
                throw httpErrors.NotFound('Restaurant not found');
            }
            const orderItems = orderDetails.items;
            const order = await OrderModel.create(orderDetails, { transaction });
            let totalAmount = 0;
            await Promise.all(
                orderItems.map(async (orderItem) => {
                    const menuItem = await MenuItemsModel.findOne({
                        where: {
                            id: orderItem.itemId,
                            restaurantId: orderDetails.restaurantId,
                            isDeleted: false
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'isDeleted', 'description', 'isAvailable']
                        }
                    });
                    if (!menuItem) throw httpErrors.NotFound(`Item with id ${orderItem.itemId} not found`);
                    totalAmount = totalAmount + menuItem.price * orderItem.itemQuantity;
                    console.log(menuItem);
                    await OrderItemsModel.create({
                        orderId: order.id,
                        itemId: menuItem.id,
                        itemName: menuItem.name,
                        itemPrice: menuItem.price,
                        itemQuantity: orderItem.itemQuantity
                    }, { transaction })
                })
            );
            order.totalAmount = totalAmount;
            await order.save({ transaction });

            await transaction.commit();
            const ordersInDB = await OrderModel.findAll({
                where: {
                    userId: order.userId,
                    isDeleted: false
                },
                include: [
                    {
                        model: OrderItemModel,
                        as: 'OrderItems',  // Alias for the association
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'isDeleted']
                        }
                    }
                ],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'isDeleted']
                }
            });
            await publishMessage('user.order', { data: { userId: orderDetails.userId, orders: ordersInDB }, event: "UPDATE_USER_ORDERS_CACHE" });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getOrderById(orderId) {
        const orderInDB = await OrderModel.findOne({
            where: {
                id: orderId,
                isDeleted: false
            },
            include: [
                {
                    model: OrderItemModel,
                    as: 'OrderItems',  // Alias for the association
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        })
        if (!orderInDB) {
            throw httpErrors.NotFound('Order not found');
        }
        return orderInDB;
    }

    async getOrders(condition) {
        try {
            const orders = await OrderModel.findAll({
                where: condition,
                include: [
                    {
                        model: OrderItemModel,
                        as: 'OrderItems',  // Alias for the association
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'isDeleted']
                        }
                    }
                ],
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'isDeleted']
                }
            });

            return orders;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async processOrder(orderDetails) {
        const orderItems = orderDetails.OrderItems;
        await Promise.all(
            orderItems.map(async (item) => {
                const itemInDB = await MenuItemsModel.findOne({
                    where: {
                        id: item.itemId,
                        isDeleted: false
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                });
                if (!itemInDB) {
                    orderDetails.orderStatus = "Cancelled";
                    await orderDetails.save();
                    throw httpErrors.NotFound(`Item with id:${item.id} not found`);
                }
                if (!itemInDB.isAvailable) {
                    orderDetails.orderStatus = "Cancelled";
                    await orderDetails.save();
                    throw httpErrors[500](`Item with id: ${item.id} currently not available. Available soon!!`);
                }
            })
        );
        orderDetails.orderStatus = "Preparing";
        await orderDetails.save();
        const userOrders = await OrderModel.findAll({
            where: {
                userId: orderDetails.userId,
                isDeleted: false,
            },
            include: [
                {
                    model: OrderItemModel,
                    as: 'OrderItems',  // Alias for the association
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        })
        await publishMessage('user.order', { data: { userId: orderDetails.userId, orders: userOrders }, event: "UPDATE_USER_ORDERS_CACHE" });

    }

    async updateOrder(orderData) {
        const orderInDB = await OrderModel.findOne({
            where: {
                id: orderData.orderId,
                isDeleted: false
            },
            include: [
                {
                    model: OrderItemModel,
                    as: 'OrderItems',  // Alias for the association
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        });
        if (!orderInDB) {
            throw httpErrors.NotFound('order not found');
        }
        if (orderData.orderStatus == "Accepted") {
            await this.processOrder(orderInDB);
            return;
        }
        orderInDB.orderStatus = orderData.orderStatus;
        await orderInDB.save();
        const userOrders = await OrderModel.findAll({
            where: {
                userId: orderInDB.userId,
                isDeleted: false,
            },
            include: [
                {
                    model: OrderItemModel,
                    as: 'OrderItems',  // Alias for the association
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        })
        await publishMessage('user.order', { data: { userId: orderInDB.userId, orders: userOrders }, event: "UPDATE_USER_ORDERS_CACHE" });
    }

    async updateOrderStatus(orderDetails) {
        const orderInDB = await OrderModel.findOne({
            where: {
                id: orderDetails.orderId,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        });
        orderInDB.orderStatus = orderDetails.orderStatus;
        await orderInDB.save();
        const userOrders = await OrderModel.findAll({
            where: {
                userId: orderInDB.userId,
                isDeleted: false,
            },
            include: [
                {
                    model: OrderItemModel,
                    as: 'OrderItems',  // Alias for the association
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'isDeleted']
                    }
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'isDeleted']
            }
        })
        await publishMessage('user.order', { data: { userId: orderInDB.userId, orders: userOrders }, event: "UPDATE_USER_ORDERS_CACHE" });

    }

    async SubscribeEvents(payload) {
        const { data, event } = payload;
        switch (event) {
            case 'UPDATE_ORDER_STATUS':
                await this.updateOrderStatus(data);
                console.log("Cache Updated SuccessFully");
                break;
            default:
                break;
        }

    }
}
module.exports = OrderService;