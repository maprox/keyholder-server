module.exports = {
    get: get,
    put: put
};

const storage = require('../storage');

/**
 * @param req
 * @param res
 */
function get(req, res) {
    const key = req.session.user.login;
    storage.get(key, function (err, reply) {
        const content = reply ? JSON.parse(reply) : null;
        if (content) {
            return res.send(content.data);
        } else {
            return res.status(404).send('Not found.');
        }
    });
}

/**
 * @param req
 * @param res
 */
function put(req, res) {
    if (!req.body || !req.body.data) {
        return res.status(400).send("Please specify 'data' parameter.");
    }
    const key = req.session.user.login;
    storage.get(key, function (err, reply) {
        const content = reply ? JSON.parse(reply) : null;
        if (content) {
            content.data = req.body.data;
            storage.set(key, JSON.stringify(content), (err) => {
                if (!err) {
                    return res.status(204).send();
                } else {
                    return res.status(500).send('Error happened, try again later.');
                }
            });
        } else {
            return res.status(404).send('Not found.');
        }
    });
}