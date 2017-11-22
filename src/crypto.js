const crypto = require('crypto');
const sha256 = (data) => crypto.createHash('sha256').update(data, 'utf8').digest('hex');

module.exports = {
    sha256: sha256
};