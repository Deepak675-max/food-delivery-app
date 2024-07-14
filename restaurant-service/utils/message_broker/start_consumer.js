const { consumeMessages } = require('./consumer');

async function startConsumers() {
    try {
        console.log("Starting consumers...");

        await Promise.all([
            consumeMessages('user_actions_exchange', 'orders', 'restaurant.orders'),
            consumeMessages('user_actions_exchange', 'order_ratings', 'restaurant.ratings'),
            consumeMessages('deilvery_agent_actions_exchange', 'orders_queue', 'restaurant.orders'),
            // consumeMessages()
        ]);

        console.log("Consumers started successfully.");
    } catch (error) {
        console.error('Error starting consumers:', error);
    }
}

module.exports = { startConsumers }
