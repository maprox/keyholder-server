module.exports = {
    get: get,
    set: set
};

const redis = require('redis');
const config = require('./config');

let redisClient;

/**
 * @returns {RedisClient}
 */
function getRedisClient() {
    if (!redisClient) {
        // create a new redis client and connect
        redisClient = redis.createClient(
            config.redis.port,
            config.redis.host
        );

        // if an error occurs, print it to the console
        redisClient.on('error', (err) => {
            console.log("REDIS: Error " + err);
        });
    }
    return redisClient;
}

/**
 * @param item
 * @param fn
 */
function get(item, fn) {
    return getRedisClient().get(item, fn);
}

/**
 * @param item
 * @param value
 * @param fn
 */
function set(item, value, fn) {
    return getRedisClient().set(item, value, fn);
}