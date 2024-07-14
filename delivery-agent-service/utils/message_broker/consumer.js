const amqp = require('amqplib');
const OrderService = require('../../services/order.service');
const DeliveryAgentService = require('../../services/delivery_agent.service');
const RatingService = require('../../services/rating.service');

async function consumeMessages(exchange, queue, routingKey) {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        await channel.assertExchange(exchange, 'direct', { durable: true });
        await channel.assertQueue(queue, { durable: true });
        await channel.bindQueue(queue, exchange, routingKey);

        console.log(" [*] Waiting for order messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const messageContent = msg.content.toString();
                console.log(" [x] Received Order: '%s'", messageContent);
                const payload = JSON.parse(messageContent);
                // Process the message based on routing key or send it to appropriate handler
                console.log(routingKey);
                if (routingKey == 'delivery_agent.orders') {
                    const orderService = new OrderService();
                    await orderService.SubscribeEvents(payload);
                }
                else if (routingKey == 'delivery_agent.agents') {
                    const deliveryAgentService = new DeliveryAgentService();
                    await deliveryAgentService.SubscribeEvents(payload);
                }
                else if (routingKey == 'delivery_agent.ratings') {
                    console.log("i amhited");
                    const ratingService = new RatingService();
                    await ratingService.SubscribeEvents(payload);
                }

                channel.ack(msg); // Acknowledge the message
            }
        });
    } catch (error) {
        console.error('Error consuming order messages:', error);
    }
}

module.exports = { consumeMessages };
