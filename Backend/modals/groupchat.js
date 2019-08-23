var connection = require('../connection/connection');
const group = new connection.Schema({
    date:{ type: Date, default: Date.now },
    createdby:connection.Schema.ObjectId,
    groupmembers: [],
    groupname: String,
    admin:connection.Schema.ObjectId,
});

var groupcreate = connection.model('groups', group);

  module.exports = groupcreate;