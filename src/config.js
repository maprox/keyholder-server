const fs = require('fs');

module.exports = {
    ssl: {
        enabled: !!process.env.SSL_PRIVATE_KEY || true,
        key: fs.readFileSync(process.env.SSL_PRIVATE_KEY || './ssl/privatekey.pem'),
        cert: fs.readFileSync(process.env.SSL_CERTIFICATE || './ssl/certificate.crt'),
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