var connection = require('../connection/connection');

const Schemamsg = new connection.Schema({
    fromUser : String,
    group_id : connection.Schema.ObjectId,
    message : String,
    date:{ type: Date, default: Date.now },
    groupname: String,
    readby:[]

  });

  var groupmsg = connection.model('groupsmessage',Schemamsg);

  module.exports = groupmsg;
