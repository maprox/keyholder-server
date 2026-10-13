module.exports = {
    get: get,
    set: set
};

const redis = require('redis');
const config = require('./config');

let redisClient;
let ready;

/**
 * @returns {Promise<import('redis').RedisClientType>}
 */
function getRedisClient() {
    if (!redisClient) {
        redisClient = redis.createClient({
            socket: {
                host: config.redis.host,
                port: Number(config.redis.port)
            }
        });

        redisClient.on('error', (err) => {
            console.log("REDIS: Error " + err);
        });

        ready = redisClient.connect();
    }
    return ready.then(() => redisClient);
}

/**
 * @param {string} item
 * @param {Function} fn
 */
function get(item, fn) {
    getRedisClient()
        .then((client) => client.get(item))
        .then((reply) => fn(null, reply))
        .catch((err) => fn(err));
}

/**
 * @param {string} item
 * @param {string} value
 * @param {Function} fn
 */
function set(item, value, fn) {
    getRedisClient()
        .then((client) => client.set(item, value))
        .then(() => fn(null, 'OK'))
        .catch((err) => fn(err));
}
