const redisClient = require('../configs/redis/redis.config');

class CacheHelper {
    static async get(key) {
        try {
            const cachedData = await redisClient.get(key);
            return cachedData ? JSON.parse(cachedData) : null;
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    static async set(key, data, ttl) {
        try {
            await redisClient.setEx(key, ttl, JSON.stringify(data));
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }

    static async del(key) {
        try {
            await redisClient.del(key);
        } catch (error) {
            console.error('Redis delete error:', error);
        }
    }
}

module.exports = CacheHelper;