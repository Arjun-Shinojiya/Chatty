var connection = require('../connection/connection');

const Schema_status = new connection.Schema({
    fromuser: { type: String, ref: 'simple-chat' },
    touser: { type: String, ref: 'simple-chat' },
    status: Boolean,
    reject_status: Boolean,
    date: { type: Date, default: Date.now },
    readstatus: Boolean,
    request_sent: Boolean,
});

var user_status = connection.model('userRequest', Schema_status);

module.exports = user_status;