const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const MenuItemModel = sequelize.define('MenuItem', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING
    },
    isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

MenuItemModel.sync().catch(error => {
    console.log(error);
})

module.exports = MenuItemModel;