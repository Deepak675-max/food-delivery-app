const sequelize = require("../utils/databases/init_postgres");

const { DataTypes } = require('sequelize');

const RatingModel = sequelize.define('Rating', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    comment: {
        type: DataTypes.STRING,
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

RatingModel.sync().catch(error => {
    console.log(error);
})

module.exports = RatingModel;