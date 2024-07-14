const amqp = require('amqplib');

async function publishMessage(routingKey, message) {
    try {
        const connection = await amqp.connect('amqp://localhost'); // Connect to RabbitMQ server
        const channel = await connection.createChannel(); // Create a channel

        const exchange = 'user_actions_exchange'; // Exchange name

        await channel.assertExchange(exchange, 'direct', { durable: true }); // Assert the exchange

        // Publish the message with the specified routing key
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));

        console.log(` [x] Sent '${routingKey}' message:`, message);

        setTimeout(() => {
            connection.close(); // Close the connection after a short delay
        }, 500);
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}

module.exports = {
    publishMessage
}
