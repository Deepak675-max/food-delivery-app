const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const UserModel = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING,
    },
    password: {
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

UserModel.sync().catch(error => {
    console.log(error);
})

module.exports = UserModel;