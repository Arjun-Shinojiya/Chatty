var connection = require('../connection/connection');
var bcrypt = require('bcrypt');


 const Schema = new connection.Schema({
    img: { type: String, ref: 'userRequest' },
    googleid :String,
    name: String,
    email: String,
    lastname: String,
    pass: String,
    phonenumber: String,
    zipcode: String,
    birthdate: String,
    username:String,
    friends: [],
    isonline : Boolean
  });

  
 
  var user = connection.model('simple-chat', Schema);

  module.exports = user;