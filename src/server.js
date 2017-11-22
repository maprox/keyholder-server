module.exports = {
    listen: listen
};

const https = require('https');
const http = require('http');
const config = require('./config');

function listen(app) {
    const httpPort = app.get('port');
    const sslPort = app.get('ssl_port');
    const sslOptions = {
        key: config.ssl.key,
        cert: config.ssl.cert
    };

    // Launching server
    http.createServer(app).listen(httpPort, logStart(httpPort));

    if (config.ssl.enabled) {
        // Launching ssl server
        https.createServer(sslOptions, app).listen(sslPort, logStart(sslPort));
    }
}

function logStart(port) {
    return () => {
        console.log("Express server listening on port " + port);
    };
}