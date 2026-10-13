module.exports = {
    get,
    put
};

const storage = require('../storage');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function get(req, res) {
    const key = req.session.user.login;
    const reply = await storage.get(key);
    const content = reply ? JSON.parse(reply) : null;

    if (content) {
        return res.send(content.data);
    }
    return res.status(404).send('Not found.');
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function put(req, res) {
    if (!req.body || !req.body.data) {
        return res.status(400).send("Please specify 'data' parameter.");
    }

    const key = req.session.user.login;
    const reply = await storage.get(key);
    const content = reply ? JSON.parse(reply) : null;

    if (!content) {
        return res.status(404).send('Not found.');
    }

    content.data = req.body.data;

    try {
        await storage.set(key, JSON.stringify(content));
        return res.status(204).send();
    } catch (err) {
        return res.status(500).send('Error happened, try again later.');
    }
}
