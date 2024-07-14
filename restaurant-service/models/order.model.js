const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const OrderModel = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderStatus: {
        type: DataTypes.ENUM('Pending', 'Accepted', 'Preparing', 'Ready for Pickup', 'Picked Up',
            'Out for Delivery', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending',
    },
    deliveryAgentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

OrderModel.sync().catch(error => {
    console.log(error);
})

module.exports = OrderModel;