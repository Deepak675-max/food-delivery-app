const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const OrderItemModel = sequelize.define('OrderItem', {
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    itemQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

OrderItemModel.sync().catch(error => {
    console.log(error);
})

module.exports = OrderItemModel;