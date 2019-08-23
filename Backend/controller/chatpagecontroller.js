const express = require("express");
var user = require('../modals/user');
var user_status = require('../modals/userstatus');
var user_convo = require('../modals/userconvo');
var path = require('path');
var moment = require('moment');
var mkdirp = require('mkdirp');
var app = express();
var download = require('image-downloader')
var sess;
var array = [];

/* get friends data api */
exports.getfriendsdata = (req,res) =>{
  console.log("friendname "+req.body.friendname);
  user.find({'name':req.body.friendname},function(err,result){
    res.json(result);
  })
}


/*open chatpage file api*/
exports.openchatpage =(req,res) =>{
    sess=req.session;
    if(sess.name == undefined){
      res.sendFile(path.resolve('../Frontend/login.html'));
    }else{
    
    
     res.sendFile(path.resolve('../Frontend/chatpage.html'));
    
    }
}; 

exports.Showuserconvo = (req,res) =>{
  sess = req.session;
  var personname = req.body.loginpersonname;
  var friendname = req.body.friendname;
  var personid = req.body.loginpersonid;
  var friendid = req.body.friendid;
  console.log("Friend id is"+friendid);
  user_convo.find({
    $and : [
        { $or : [ { fromuser :sess._id}, { fromuser : friendid } ] },
        { $or : [ { touser :sess._id }, { touser :friendid } ] }
    ]
},function(err,doc){
    if(err){
      console.log(err);
    }else{
      console.log("sosbososvosnvs"+doc);
      res.send(doc); 
     user.update({
      'name':sess.name,
      },
      {
        $set : {
              'isonline' : true,
        }
      },{
        multi:true
      },function(err,result){
       
      }); 

      user_convo.update({
        "fromuser" : friendid,
        "touser" : personid
    }, {
        $set : {
            readstatus : true
        }
    }, {
        multi :true
    },function(err, result) {});
  
    /*   user_convo.aggregate([   
        {
            $lookup : {
                from: "simple-chats",
                localField : "fromuser",
                foreignField : "_id",
                as : "fromUserArray",
                
            }},{
            $lookup : {
                from: "simple-chats",
                localField : "touser",
                foreignField : "_id",
                as : "toUserArray"
            }
        }  
    ]).exec(function(err, result) {
        if(err) {
            return err;
        } else {
            console.log("Hello There : ");
            console.log(result);
            console.log("===========================================================");
            for(var i=0; i<result.length; i++){
                
                array[i] = result[i].fromUserArray;
            }

            for(var j=array.length; j<result.length; j++){
                
                array[j] = result[j].toUserArray;
            }
            
            res.send(result);
        }
    }); */
    }
  }); 
}

