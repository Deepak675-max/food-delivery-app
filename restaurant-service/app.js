require('dotenv').config();
const express = require('express');
const sequelize = require('./utils/databases/init_postgres.js');
const { APP_PORT } = require('./config/index');
require('./utils/databases/init_redis.js');
require('./models/model_association.js');
const httpErrors = require('http-errors');
const { startConsumers } = require('./utils/message_broker/start_consumer.js');

const app = express();

app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/health-check', (req, res, next) => {
    res.send("ok");
})

const restaurantRoutes = require('./routes/restaurant.route.js');
app.use('/api', restaurantRoutes);

const orderRoutes = require('./routes/order.route.js');
app.use('/api', orderRoutes);

const deliveryAgentRoutes = require('./routes/delivery_agent.route.js');
app.use('/api', deliveryAgentRoutes);

const ratingRoutes = require('./routes/rating.route.js');
app.use('/api', ratingRoutes);

app.use(async (req, _res, next) => {
    next(httpErrors.NotFound(`Route not Found for [${req.method}] ${req.url}`));
});

// Common Error Handler
app.use((error, req, res, next) => {
    const responseStatus = error.status || 500;
    const responseMessage =
        error.message || `Cannot resolve request [${req.method}] ${req.url}`;
    if (res.headersSent === false) {
        res.status(responseStatus);
        res.send({
            error: {
                status: responseStatus,
                message: responseMessage,
            },
        });
    }
    next();
});


sequelize.sync({ alter: true })
    .catch(error => {
        console.log(error);
        process.exit(0);
    })

app.listen(APP_PORT, async () => {
    console.log("Restaurant service is running on the port " + APP_PORT);
    startConsumers();
})

