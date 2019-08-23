const express = require("express");
var user = {};
var user = require('../modals/user');
var user_status = require('../modals/userstatus');
var user_convo = require('../modals/userconvo');
var path = require('path');
var app = express();
var sess;
var firsttablecount ;
var secondtablecount ;
var totalcount;

/*chatrequest page html api */
exports.chatrequestpage = (req, res) => {
    sess = req.session;
    sess.name;
    if(sess._id == undefined){
      res.sendFile(path.resolve('../Frontend/login.html'));
    }else{
    res.sendFile(path.resolve('../Frontend/chatrequestpage.html'));
    }
};

/*Notification chatrequest data of user*/
exports.notificationapi =  (req, res) => {
    sess=req.session;
    user_status.distinct('fromuser', { $and: [{ 'touser': sess._id}, { 'status': false }, { 'reject_status': false }] }, (err, doc) => {
      if (err) {
        console.log(err);
      }
      else {
       /*  */
        console.log("requestdata api doc",doc);
        user.find({"_id":doc},(err,result)=>{
          console.log("User request data response",JSON.stringify(result));
          res.json(result);
        })
         user_status.find({ $and: [{ 'touser': sess._id }, { 'status': false }, { 'reject_status': false }] }, (err, result) => {
          console.log("ALL USERS :" + result)
          user_status.update({
  
          }, {
              $set: {
                readstatus: true
              }
            }, {
              multi: true
            }, function (err, exec) {
              console.log("SUCCESS");
            });
        }); 
      }
    });
  };

/*Show user message notification api */
exports.Showusermessagenotification = (req,res) =>{
  sess = req.session;
  console.log("loginperson nameeeeeee"+req.body.name);
  user_convo.distinct("fromuser",{$and:[{'touser' : sess._id},{'readstatus': false}]},(err,doc)=>{
    if(err){
      console.log(err);
    }else{
      console.log("repsonse from message notification api" +doc);
      /* res.send(doc); */
      user.find({_id:doc},(err,result)=>{
        
        res.send(result);
      })
    /*   user_convo.update({
        'touser':sess._id
      },
        {
          $set : {
                'readstatus' : true,
            }
        },{
          multi:true
        },function(err,result){
          console.log("successfully changed user read status");
        }); */
      
          user.update({
            '_id':sess._id
          },
            {
              $set : {
                    
                    'isonline' : false
              }
            },{
              multi:true
            },function(err,result){
              console.log("successfully changed user read status");
            });
    }
   
  })
}

/*Notification count of user chat request */

 exports.notificationcountapi =(req, res) => {
    sess = req.session;
    console.log("HEADERSSSSSS"+req.headers);
    user_status.find({ $and: [{ 'touser': sess._id }, { 'readstatus': false }] }, (err, doc) => {
    
      firsttablecount = doc.length;
       user_convo.find({$and: [{'touser':sess._id},{'readstatus':false}]},(err,doc)=>{
      
       secondtablecount = doc.length;
       totalcount = firsttablecount+secondtablecount;
       console.log("Total count"+totalcount);
      res.json({totalcount});
     });
    }); 
};

/*Show notified user data */
exports.ShownotifiedUserdata = (req,res) =>{
  sess = req.session;
 
  user.find({name : req.body.notifiedpersonname},(err,user)=>{
  res.send(user);
  })
}

 /*On click accept button api */
 var accepteduserid;
 exports.acceptbuttonapi =  (req, res) => {
    sess = req.session;
    user.find({name:req.body.object},(err,result)=>{
      console.log("accepted button api user id",result[0]._id);
       accepteduserid = result[0]._id;
      user_status.update({
        'fromuser': accepteduserid,
        'touser': sess._id,
      }, {
          $set: {
            "status": true,
           }
        }, {
          multi: true
        }, function (err, result) {
          console.log("result of accept button"+result[0]);
       
        });
        user.update({
          '_id':sess._id
          },{ 
            $push: {
                    friends:
                          {
                            friendname:req.body.object
                          }
                    }
            },function (err,result) {
         console.log("successfully saved buddy"+result);
          });
       
         user.update({
          '_id':accepteduserid
          },{ 
            $push: {
                    friends:
                          {
                            friendname:sess.name
                          }
            }
          },function (err,result) {
          console.log("successfully saved buddy"+result);
          });
    })
   
      res.send();
};

/*on click reject button api */
var deleteduserid
exports.rejectbuttonapi = (req, res) => {

    sess=req.session;
    user.find({'name':req.body.deleted},(err,result)=>{
      deleteduserid = result[0]._id;
      user_status.update({
        'fromuser': deleteduserid,
        'touser': sess._id,
      }, {
          $set: {
            "reject_status": true,
            "request_sent": false,
          }
        }, {
          multi: true
        }, function (err, result) {
          console.log(result);
        });
    })
   
    res.send();
  };
  
