module.exports = {
    init,
    signUp,
    signIn
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
 * @returns {Promise<object|false>}
 */
async function signUp(login, secret, data) {
    const reply = await storage.get(login);
    if (reply) {
        return false;
    }

    const content = {
        hash: crypto.sha256(login + ':' + secret),
        data: data
    };

    try {
        await storage.set(login, JSON.stringify(content));
        return signIn(login, secret);
    } catch (err) {
        console.error('Error happened during sign up. ', err);
        return false;
    }
}

/**
 * @param {string} login
 * @param {string} secret
 * @returns {Promise<object|false>}
 */
async function signIn(login, secret) {
    const reply = await storage.get(login);
    const content = reply ? JSON.parse(reply) : null;

    if (!content || content.hash !== crypto.sha256(login + ':' + secret)) {
        return false;
    }

    const options = {expiresIn: '1h'};
    const payload = {
        user: {
            login: login
        }
    };

    try {
        const token = jwt.sign(payload, config.jwt.secret, options);
        return {
            token: token,
            data: content.data
        };
    } catch (err) {
        console.error('Can\'t generate token: ', err);
        return false;
    }
}

/**
 * @param {string} token
 * @returns {object}
 */
function getSession(token) {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (err) {
        return null;
    }
}
