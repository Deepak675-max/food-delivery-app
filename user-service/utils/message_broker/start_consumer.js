const { consumeMessages } = require('./consumer');

async function startConsumers() {
    try {
        console.log("Starting consumers...");

        await Promise.all([
            consumeMessages('restaurant_actions_exchange', 'online_restaurant', 'user.restaurant'),
            consumeMessages('restaurant_actions_exchange', 'user_orders', 'user.order'),
            // consumeMessages('delivery_agent_actions_exchnage', 'orders', 'user.order'),
        ]);

        console.log("Consumers started successfully.");
    } catch (error) {
        console.error('Error starting consumers:', error);
    }
}

module.exports = { startConsumers }
