const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const RestaurantModel = sequelize.define('Restaurant', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM("Online", "Offline"),
        defaultValue: "Offline",
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

RestaurantModel.sync().catch(error => {
    console.log(error);
})

module.exports = RestaurantModel;