const express = require("express");
const fs = require('fs');
var store = require('store');
var user = require('../modals/user');
var user_status = require('../modals/userstatus');
var group = require('../modals/groupchat');
var path = require('path');
var app = express();
var sess;

/*get Modifieduser page api */
exports.Modifieduserpage = (req, res) => {
    sess = req.session;
    sess._id;
    console.log("session id" +sess._id);
    
    if(sess._id == undefined){
      res.sendFile(path.resolve('../Frontend/login.html'));
    }else{
      
      var username = store.get('username');
      var userid = store.get('userid');
      var userimage = store.get('userimage');
      if(username == null){
        console.log("First loop of modified user");
        store.clearAll();
        res.render(path.resolve('../Frontend/modifieduser.html'));
       
        
      }else{
        console.log("second loop of modified user");
        res.render(path.resolve('../Frontend/modifieduser.html'),{username:username});
        
      }
     
    }
   };

/*User List data Api */
exports.getUserdata = (req, res) => {
    sess = req.session;
    console.log("session id"+sess._id);
    user.find( { $and :  [{ "_id" : {$ne : sess._id} },{"friends": {"$not":{"$elemMatch":{"friendname":{$in:[sess.name]}}}} }]}, (err, users) => {
    res.send(users);
    user.update({
      '_id':sess._id
    },
      {
        $set : {
              
              'isonline'   : false
        }
      },{
        multi:true
      },function(err,result){
        console.log("successfully changed user read status");
      });
    });
};

/*Friends list data Api*/
exports.getFriendslist =  async(req, res) => {
    sess = req.session;
    try{
      let friendsArr = [];
      let result = await user.find({ _id: sess._id });
    
      for (let userobj of result) {
  
        for (let friends of userobj.friends) {
            if (friends.friendname != null) {
                let friendname = friends.friendname;
               let userFriend = await user.find({ name: friendname });
               if (userFriend) friendsArr.push(userFriend); 
            }
            else {
                console.log("No friend found");
            }
        }
    }
   console.log("friendsArr is ",friendsArr);
   res.send(friendsArr);
   } catch (err) {
    console.log(err);
    }
};

/*Show accept and reject status api */

exports.statusapi =  (req, res) => {
    sess=req.session;
    var i;
    var arr = [];
    user_status.find({ "fromuser": sess._id }, (err, doc) => {
      for (i = 0; i < doc.length; i++) {
  
        arr[i] = doc[i];
      }
      console.log(arr);
      res.json(arr);
    });
  };

exports.ontabclose = (req,res) =>{
  sess = req.session;
  user.update({
    '_id':sess._id
  },
    {
      $set : {
        'isonline'   : false
      }
    },{
      multi:true
    },function(err,result){
   
      res.send(result);
    });
 
}