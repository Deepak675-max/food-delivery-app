const Sequelize = require("sequelize");
const { POSTGRES_DB_NAME, POSTGRES_HOST, POSTGRES_PASS, POSTGRES_USER } = require('../../config/index');

const sequelize = new Sequelize(
    POSTGRES_DB_NAME,
    POSTGRES_USER,
    POSTGRES_PASS,
    {
        host: POSTGRES_HOST,
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

sequelize.authenticate().then(() => {
    console.log('Database Connected Successfully!.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports = sequelize;