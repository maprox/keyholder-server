module.exports = {
    init: init,
    signUp: signUp,
    signIn: signIn
};

const jwt = require('jsonwebtoken');
const config = require('./config');
const storage = require('./storage');
const crypto = require('./crypto');

/**
 * @param {object} app
 */
function init(app) {
    app.use((req, res, next) => {
        const match = req.headers
           && req.headers.authorization
           && req.headers.authorization.match(/^Bearer\s+(\S+)$/);
        if (match && match[1]) {
            req.session = getSession(match[1]);
            if (req.session) {
                return next();
            } else {
                return res.status(403).send('Forbidden.');
            }
        } else {
            return res.status(401).send('Unauthorized.');
        }
    });
}

/**
 * @param {string} login
 * @param {string} secret
 * @param {string} data
 * @param {Function} callback
 */
function signUp(login, secret, data, callback) {
    return storage.get(login, (err, reply) => {
        if (reply) {
            return callback(false);
        }

        const content = {
            hash: crypto.sha256(login + ':' + secret),
            data: data
        };

        return storage.set(login, JSON.stringify(content), (err) => {
            if (!err) {
                return signIn(login, secret, callback);
            } else {
                console.error('Error happened during sign up. ', err);
                return callback(false);
            }
        });
    });
}

/**
 * @param {string} login
 * @param {string} secret
 * @param {Function} callback
 */
function signIn(login, secret, callback) {
    return storage.get(login, (err, reply) => {
        const content = reply ? JSON.parse(reply) : null;

        if (!content || content.hash !== crypto.sha256(login + ':' + secret)) {
            callback(false);
            return;
        }

        const options = {expiresIn: '1h'};
        const payload = {
            user: {
                login: login
            }
        };

        return jwt.sign(payload, config.ssl.key, options, (err, token) => {
            const payload = {
                token: token,
                data: content.data
            };
            if (err) {
                console.error('Can\'t generate token: ', err);
            }
            return callback(!err ? payload : false);
        });
    });
}

/**
 * @param {string} token
 * @returns {object}
 */
function getSession(token) {
    try {
        return jwt.verify(token, config.ssl.key);
    } catch (err) {
        console.error(err);
        return null;
    }
}