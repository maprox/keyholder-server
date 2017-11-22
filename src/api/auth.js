module.exports = {
    signUp: signUp,
    signIn: signIn
};

const auth = require('../auth');

/**
 * @param req
 * @param res
 */
function signUp(req, res) {
    if (!req.body
        || !req.body.login
        || !req.body.secret
    ) {
        return res.status(400).send("Please specify 'login' and 'secret' parameters.");
    }
    return auth.signUp(
        req.body.login,
        req.body.secret,
        (payload) => payload
            ? res.json(payload)
            : res.status(401).send("User already exists.")
    );
}

/**
 * @param req
 * @param res
 */
function signIn(req, res) {
    if (!req.body
        || !req.body.login
        || !req.body.secret
    ) {
        return res.status(400).send("Please specify 'login' and 'secret' parameters.");
    }
    return auth.signIn(
        req.body.login,
        req.body.secret,
        req.body.data || null,
        (payload) => payload
            ? res.json(payload)
            : res.status(401).send("Authentication failed.")
    );
}