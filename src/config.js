const fs = require('fs');

const isSslEnabled = !!process.env.SSL_PRIVATE_KEY;

module.exports = {
    ssl: {
        enabled: isSslEnabled,
        key: isSslEnabled ? fs.readFileSync(process.env.SSL_PRIVATE_KEY) : null,
        cert: isSslEnabled ? fs.readFileSync(process.env.SSL_CERTIFICATE) : null,
        port: process.env.SSL_PORT || 3443
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379
    },
    http: {
        port: process.env.PORT || 3000
    }
};