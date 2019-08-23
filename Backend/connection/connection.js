var mongoose = require('mongoose');


var  connection = mongoose.connect('mongodb://localhost:27017/simple-chat',{useNewUrlParser:true} )
.then(()=>
console.log("Mongodb connected"))
.catch(err => console.error("could not connected",err));



module.exports = connection;
module.exports = mongoose;
