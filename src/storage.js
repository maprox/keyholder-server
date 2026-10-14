module.exports = {
    get,
    set
};

const redis = require('redis');
const config = require('./config');

let redisClient;
let ready;

/**
 * @returns {Promise<import('redis').RedisClientType>}
 */
async function getRedisClient() {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: config.redis.host,
                port: Number(config.redis.port)
            }
        });

        redisClient.on('error', (err) => {
            console.log('REDIS: Error ' + err);
        });

        ready = redisClient.connect();
    }
    await ready;
    return redisClient;
}

/**
 * @param {string} item
 * @returns {Promise<string|null>}
 */
async function get(item) {
    const client = await getRedisClient();
    return client.get(item);
}

/**
 * @param {string} item
 * @param {string} value
 * @returns {Promise<string>}
 */
async function set(item, value) {
    const client = await getRedisClient();
    return client.set(item, value);
}
