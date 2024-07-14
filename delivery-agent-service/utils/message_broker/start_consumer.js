const { consumeMessages } = require('./consumer');

async function startConsumers() {
    try {
        console.log("Starting consumers...");

        await Promise.all([
            consumeMessages('restaurant_actions_exchange', 'agent_orders', 'delivery_agent.orders'),
            consumeMessages('restaurant_actions_exchange', 'agents', 'delivery_agent.agents'),
            consumeMessages('user_actions_exchange', 'agent_ratings', 'delivery_agent.ratings'),
        ]);

        console.log("Consumers started successfully.");
    } catch (error) {
        console.error('Error starting consumers:', error);
    }
}

module.exports = { startConsumers };
