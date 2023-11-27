const crypto = require('crypto');
require("dotenv-safe").config();

function sha512(password) {
    const hash = crypto.createHmac('sha512', process.env.SECRET_USERS);
    hash.update(password);
    return hash.digest('hex');
}

module.exports = { sha512 };
