const Redis = require('ioredis');

// Create a new instance of Redis client
const redisClient = new Redis({
    port: process.env.REDIS_PORT,     // Redis port
    host: process.env.REDIS_HOST,     // Redis host
    password: process.env.REDIS_PASS, // Redis password (if required)
    enableAutoPipelining: true,       // Enable auto pipelining
});

// Handle connection events
redisClient.on('connect', () => {
    console.log('Connected to Redis server');
});

redisClient.on('error', (err) => {
    console.error('Error connecting to Redis:', err);
});

redisClient.on('close', () => {
    console.log('Disconnected from Redis server');
});


// Handle application termination
process.on('SIGINT', async () => {
    await redisClient.quit();
    console.log('Redis connection closed');
    process.exit(0);
});

// Export Redis client instance
module.exports = redisClient;
