const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const DeliveryAgentModel = sequelize.define('DeliveryAgent', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Busy', 'Available'),
        defaultValue: 'Available'
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

DeliveryAgentModel.sync().catch(error => {
    console.log(error);
})

module.exports = DeliveryAgentModel;