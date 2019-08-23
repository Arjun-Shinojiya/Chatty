var connection = require('../connection/connection');
var ObjectId = connection.Schema.ObjectId;
const Schema_msg = new connection.Schema({
   
    date:{ type: Date, default: Date.now },
    fromuser:connection.Schema.ObjectId,
    touser:connection.Schema.ObjectId,
    message:{type:String},
    image :{type:String},
    readstatus:Boolean,
    uniqueid:{type:String},
    isonline : Boolean
});

var user_convo = connection.model('userconversation',Schema_msg);
module.exports = user_convo;