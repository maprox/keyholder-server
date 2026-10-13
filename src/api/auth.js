module.exports = {
    signUp,
    signIn
};

const auth = require('../auth');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function signUp(req, res) {
    if (!req.body
        || !req.body.login
        || !req.body.secret
    ) {
        return res.status(400).send("Please specify 'login' and 'secret' parameters.");
    }

    const payload = await auth.signUp(
        req.body.login,
        req.body.secret,
        req.body.data || null
    );

    return payload
        ? res.json(payload)
        : res.status(401).send('User already exists.');
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function signIn(req, res) {
    if (!req.body
        || !req.body.login
        || !req.body.secret
    ) {
        return res.status(400).send("Please specify 'login' and 'secret' parameters.");
    }

    const payload = await auth.signIn(req.body.login, req.body.secret);

    return payload
        ? res.json(payload)
        : res.status(401).send('Authentication failed.');
}
