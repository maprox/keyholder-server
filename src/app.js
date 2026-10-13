const express = require('express');

const config = require('./config');
const api_auth = require('./api/auth');
const api_store = require('./api/store');

/**
 * @returns {import('express').Express}
 */
function createApp() {
    const app = express();

    app.set('port', config.http.port);
    app.set('ssl_port', config.ssl.port);

    app.use(express.urlencoded({extended: true}));
    app.use(express.json());

    app.post('/api/sign_up', api_auth.signUp);
    app.post('/api/sign_in', api_auth.signIn);

    require('./auth').init(app);

    app.get('/api/storage', api_store.get);
    app.put('/api/storage', api_store.put);

    return app;
}

module.exports = {
    createApp
};
