require('dotenv').config();
const redis = require('redis');

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
};

const client = redis.createClient(redisConfig);

client.connect().catch(console.error);

module.exports = client;