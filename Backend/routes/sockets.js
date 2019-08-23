"use strict";
var user1 = require('../modals/user');
var user_status = require('../modals/userstatus');
var user_convo = require('../modals/userconvo');
var group = require('../modals/groupchat');
var groupChat = require('../modals/groupchatmodal');
var moment = require('moment');
const fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var rn = require('random-number');
var Promise = require('promise');
var user = {};
var user_socket_id = {};
var x;
var chatuserid,requserid;

/*socket connect */


const sockets = [];
exports = module.exports=function(io) {
  
io.sockets.on('connection', (socket) => {
    console.log('a user is connected');
    var initiatorChannel = '';
   
    socket.on('join', function (req) {
      /* console.log(req.user_id); */
      if (req.user_id != 0) {
        socket.join(req.user_id);
        user[socket.id] = req.user_id;
        user_socket_id[req.user_id] = socket.id;
        x = user_socket_id[req.user_id];
        /* console.log(user); */
        
        console.log(socket.id);
      
      } else {
        console.log('no user_id');
      }
  
    });
   
    /*friend request socket */
    socket.on('send_chat_request', function (data) {
      /*  console.log('send_chat_request'); */
      user1.find({"name": data.chat_user_id},(err,res)=>{
        
       requserid = data.req_user_id;
       chatuserid = res[0]._id;
       console.log("Logged In User:" + data.req_user_id);
       console.log("Send Request To:" + data.chat_user_id);
       console.log("Logged in user id"+ requserid);
       console.log('chat user id'+ chatuserid);
       user_status.find({ "fromuser": requserid, "touser": chatuserid, "reject_status": false }, (err, doc) => {
         if (doc.length == 0) {
           var userstatus = new user_status();
           userstatus.fromuser = requserid,
             userstatus.touser = chatuserid,
             userstatus.status = 0,
             userstatus.reject_status = 0,
             userstatus.readstatus = 0,
             userstatus.request_sent = 1,
             userstatus.save();
           io.to(user_socket_id[data.chat_user_id]).emit('receive_chat_request', data);
         }
   
         else {
           console.log("Friend Request:" + doc.length);
   
           if (doc[0].status == 0 && doc[0].request_sent == 0) {
             var userstatus = new user_status();
             userstatus.fromuser = requserid
               userstatus.touser = chatuserid,
               userstatus.status = 0,
               userstatus.reject_status = 0,
               userstatus.request_sent = 1,
               userstatus.save();
             io.to(user_socket_id[data.chat_user_id]).emit('receive_chat_request', data);
   
           }
           else {
             console.log("Already Friend");
             io.to(user_socket_id[data.req_user_id]).emit('already_friend', data);
           }
         }
        
       });
      });
     });

    /*Socket for messaage send and get */
    socket.on('message',(data)=>{
      console.log('User socket od from another event' +x);
      user1.find({ $and : [{ "_id" : data.friendid }, { "isonline" : true }] }, (err, doc1) => {
        var userconvo = new user_convo();
        if(doc1.length <= 0) {
            console.log("In parent 1st if : ");
          user_convo.find({
            $or : [
                { $and : [ { 'fromuser' : data.loginpersonid }, { 'touser' : data.friendid } ] },
                { $and  : [ { 'fromuser' : data.friendid }, { 'touser' : data.loginpersonid } ] }
            ]
        },(err,result)=>{
            if(result.length == 0){
              userconvo.fromuser = data.loginpersonid;
              userconvo.touser = data.friendid;
              userconvo.message = data.message;
              userconvo.readstatus = 0; //For notitication functionality
             userconvo.uniqueid = x;
              userconvo.save(function(err,doc){});
              io.to(user_socket_id[data.touser]).emit('messages',data);
              io.to(user_socket_id[data.touser]).emit('receive_chat_request',data);
            }else{
              console.log("ELSE loop"+JSON.stringify(result));
              userconvo.fromuser = data.loginpersonid;
              userconvo.touser = data.friendid;
              userconvo.message = data.message;
              userconvo.readstatus = 0; //For notitication functionality
              userconvo.uniqueid = result[0].uniqueid;
              userconvo.save(function(err,doc){});
              io.to(user_socket_id[data.touser]).emit('messages',data);
              io.to(user_socket_id[data.touser]).emit('receive_chat_request',data);
            }
          })           
        } else {
          user_convo.find({
            $or : [
                { $and : [ { 'fromuser' : data.loginpersonid }, { 'touser' : data.friendid } ] },
                { $and : [ { 'fromuser' : data.friendid }, { 'touser' : data.loginpersonid } ] }
            ]
        },(err,result)=>{
            if(result.length == 0){
              console.log("firstloop");
              userconvo.fromuser = data.loginpersonid;
              userconvo.touser = data.friendid;
              userconvo.message = data.message;
              userconvo.readstatus = 1; //For notitication functionality
             userconvo.uniqueid = x;
              userconvo.save(function(err,doc){});
              io.to(user_socket_id[data.touser]).emit('messages',data);
            }else{
              console.log("RESULTTTTTT"+result[0].uniqueid);
              userconvo.fromuser = data.loginpersonid;
              userconvo.touser = data.friendid;
              userconvo.message = data.message;
              userconvo.readstatus = 1; //For notitication functionality
              userconvo.uniqueid = result[0].uniqueid;
              userconvo.save(function(err,doc){});
              io.to(user_socket_id[data.touser]).emit('messages',data);
            }
          }) 
          user_convo.update({
            "fromuser" : data.friendid,
            "touser" : data.loginpersonid
        }, {
            $set : {
                readstatus : true
            }
        }, {
            multi :true
        },function(err, result) {
         });
        }
    });
});

    /** Socket for sending image and receiveing */
    socket.on('user image', function (msg) {
      console.log('User socket od from another event' +x);
     
      var filename = msg.imagename;
      var loginname = msg.fromuser;
      var friendname = msg.touser;
      
      console.log("Filename "+filename);
     /*  var image = msg.image.replace(/^data:([A-Za-z-+/]+);base64,/, "");  */
     var image = msg.image.replace(/^data:(.*?);base64,/, ""); 
    
     
      user1.find({ $and : [{ "_id" : msg.friendid }, { "isonline" : true }] },(err, doc1)=>{
       
        if(doc1.length <= 0) {
          user_convo.find({
            $or : [
                { $and : [ { 'fromuser' : msg.loginpersonid }, { 'touser' : msg.friendid } ] },
                { $and  : [ { 'fromuser' : msg.friendid }, { 'touser' : msg.loginpersonid } ] }
            ]
        },(err,result3)=>{
         
            if(result3.length == 0){
              console.log("First loop");
              /* promise intiate */
              function checkCreateDirectory(){
              return new Promise((resolve,reject) =>{
                console.log("inside promise loop");
               
                  mkdirp('public/chatfolders/'+x+'/'+loginname+'/sent',function(err,result){
                   
                      resolve({result:'success'});
                    
                  });
                 
                  mkdirp('public/chatfolders/'+x+'/'+loginname+'/received',function(err,result){
                    
                      resolve({result:'success'});
                    
                  });
                  mkdirp('public/chatfolders/'+x+'/'+friendname+'/sent',function(err,result){
                   
                      resolve({result:'success'});
                    
                  });
                  mkdirp('public/chatfolders/'+x+'/'+friendname+'/received',function(err,result){
                   
                      resolve({result:'success'});
                    
                  });
               });
            }
          /* return promise */
           return checkCreateDirectory().then(Response =>{
            var filepath = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+x+'/'+loginname+'/sent/'+filename);
            var file1path = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+x+'/'+friendname+'/received/'+filename );
            console.log("inside after promise loop");
           
           
             fs.writeFile(filepath, image.replace(/ /g, '+'), 'base64', function(err,result){
                fs.writeFile(file1path, image.replace(/ /g, '+'), 'base64', function(){});
                 if(err){
                   console.log("ERR"+err);
                 }
                 console.log("result first"+JSON.stringify(result));
                 console.log("file path"+filepath);
                 console.log("file1 path"+file1path);
                 var userconvo = new user_convo();
                 userconvo.fromuser = msg.loginpersonid;
                 userconvo.touser = msg.friendid;
                 userconvo.image = x+'/'+loginname+'/sent/'+filename ;
                 userconvo.uniqueid = x;
                 userconvo.readstatus = 0; //For notitication functionality
                 userconvo.save(function(err,doc){});
                 io.to(user_socket_id[msg.touser]).emit('user image', msg);
                 io.to(user_socket_id[msg.touser]).emit('receive_chat_request',msg);
                });
            
            }).catch(err =>{
                console.log("catch error" + err);
            });
          }else{
            console.log("Second loop");
            function checkCreateDirectory(){
                
              return new Promise((resolve,reject) =>{
                console.log("inside promise loop");
               
                  mkdirp('public/chatfolders/'+result3[0].uniqueid+'/'+loginname+'/sent',function(err,result){
                  
                      resolve({result:'success'});
                    
                  });
                 
                  mkdirp('public/chatfolders/'+result3[0].uniqueid+'/'+loginname+'/received',function(err,result){
                   
                      resolve({result:'success'});
                    
                  });
                  mkdirp('public/chatfolders/'+result3[0].uniqueid+'/'+friendname+'/sent',function(err,result){
                    
                      resolve({result:'success'});
                    
                  });
                  mkdirp('public/chatfolders/'+result3[0].uniqueid+'/'+friendname+'/received',function(err,result){
                  
                      resolve({result:'success'});
                    
                  });
               });
            }
            return checkCreateDirectory().then(Response =>{
              var filepath = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+result3[0].uniqueid+'/'+loginname+'/sent/'+filename );
              var file1path = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+result3[0].uniqueid+'/'+friendname+'/received/'+filename );
              console.log("inside after promise loop");
             
             
               fs.writeFile(filepath,image.replace(/ /g, '+'), 'base64', function(err,result){
                  fs.writeFile(file1path,image.replace(/ /g, '+'), 'base64', function(){});
                   if(err){
                     console.log("ERR"+err);
                   }
                   console.log("result first"+JSON.stringify(result));
                   console.log("file path"+filepath);
                   console.log("file1 path"+file1path);
                   var userconvo = new user_convo();
                   userconvo.fromuser = msg.loginpersonid;
                   userconvo.touser = msg.friendid;
                   userconvo.image = result3[0].uniqueid+'/'+loginname+'/sent/'+filename ;
                   userconvo.uniqueid = result3[0].uniqueid;
                   userconvo.readstatus = 0; //For notitication functionality
                   userconvo.save(function(err,doc){});
                   io.to(user_socket_id[msg.touser]).emit('user image', msg);
                   io.to(user_socket_id[msg.touser]).emit('receive_chat_request',msg);
                  });
              
              }).catch(err =>{
                  console.log("catch third error" + err);
              });
            
              }
          });
       }else
       {
              user_convo.find({
              $or : [
                  { $and : [ { 'fromuser' : msg.loginpersonid }, { 'touser' : msg.friendid } ] },
                  { $and  : [ { 'fromuser' : msg.friendid }, { 'touser' : msg.loginpersonid } ] }
              ]
          },(err,result2)=>{
              if(result2.length == 0){
                function checkCreateDirectory(){
                  console.log("Third loop");
                  return new Promise((resolve,reject) =>{
                    console.log("inside promise loop");
                   
                      mkdirp('public/chatfolders/'+x+'/'+loginname+'/sent',function(err,result){
                       
                          resolve({result:'success'});
                        
                      });
                     
                      mkdirp('public/chatfolders/'+x+'/'+loginname+'/received',function(err,result){
                      
                          resolve({result:'success'});
                        
                      });
                      mkdirp('public/chatfolders/'+x+'/'+friendname+'/sent',function(err,result){
                       
                          resolve({result:'success'});
                        
                      });
                      mkdirp('public/chatfolders/'+x+'/'+friendname+'/received',function(err,result){
                       
                          resolve({result:'success'});
                        
                      });
                   });
                }
    
                /* return promise */
               return checkCreateDirectory().then(Response =>{
                var filepath = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+x+'/'+loginname+'/sent/'+filename );
                var file1path = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+x+'/'+friendname+'/received/'+filename );
                console.log("inside after promise loop");
               
               
                 fs.writeFile(filepath,image.replace(/ /g, '+'), 'base64', function(err,result){
                    fs.writeFile(file1path,image.replace(/ /g, '+'), 'base64', function(){});
                     if(err){
                       console.log("ERR"+err);
                     }
                     console.log("result first"+JSON.stringify(result));
                     console.log("file path"+filepath);
                     console.log("file1 path"+file1path);
                     var userconvo = new user_convo();
                     userconvo.fromuser = msg.loginpersonid;
                     userconvo.touser = msg.friendid;
                     userconvo.image = x+'/'+loginname+'/sent/'+filename ;
                     userconvo.uniqueid = x;
                     userconvo.readstatus = 1; //For notitication functionality
                     userconvo.save(function(err,doc){});
                     io.to(user_socket_id[msg.touser]).emit('user image', msg);
                    });
                
                }).catch(err =>{
                    console.log("catch third error" + err);
                });
              }
              else{
                console.log("fourth loop");
                function checkCreateDirectory(){
                
                  return new Promise((resolve,reject) =>{
                    console.log("inside promise loop");
                   
                      mkdirp('public/chatfolders/'+result2[0].uniqueid+'/'+loginname+'/sent',function(err,result){
                      
                          resolve({result:'success'});
                        
                      });
                     
                      mkdirp('public/chatfolders/'+result2[0].uniqueid+'/'+loginname+'/received',function(err,result){
                       
                          resolve({result:'success'});
                        
                      });
                      mkdirp('public/chatfolders/'+result2[0].uniqueid+'/'+friendname+'/sent',function(err,result){
                        
                          resolve({result:'success'});
                        
                      });
                      mkdirp('public/chatfolders/'+result2[0].uniqueid+'/'+friendname+'/received',function(err,result){
                      
                          resolve({result:'success'});
                        
                      });
                   });
                }
                return checkCreateDirectory().then(Response =>{
                  var filepath = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+result2[0].uniqueid+'/'+loginname+'/sent/'+filename );
                  var file1path = path.resolve('D:/ChatappGit/Backend/public/chatfolders/'+result2[0].uniqueid+'/'+friendname+'/received/'+filename );
                  console.log("inside after promise loop");
                 
                 
                   fs.writeFile(filepath,image.replace(/ /g, '+'), 'base64', function(err,result){
                      fs.writeFile(file1path, image.replace(/ /g, '+'), 'base64', function(){});
                       if(err){
                         console.log("ERR"+err);
                       }
                       console.log("result first"+JSON.stringify(result));
                       console.log("file path"+filepath);
                       console.log("file1 path"+file1path);
                       var userconvo = new user_convo();
                       userconvo.fromuser = msg.loginpersonid;
                       userconvo.touser = msg.friendid;
                       userconvo.image = result2[0].uniqueid+'/'+loginname+'/sent/'+filename ;
                       userconvo.uniqueid = result2[0].uniqueid;
                       userconvo.readstatus = 1; //For notitication functionality
                       userconvo.save(function(err,doc){});
                       io.to(user_socket_id[msg.touser]).emit('user image', msg);
                      });
                  
                  }).catch(err =>{
                      console.log("catch third error" + err);
                  });
                 }
             });
            user_convo.update({
              "fromuser" : msg.friendid,
              "touser" : msg.loginpersonid
          }, {
              $set : {
                  readstatus : true
              }
          }, {
              multi :true
          },function(err, result) {});
        }
      });
    });

    /* group message socket */
    socket.on('create', function(data) {
    
      group.findOne({ "groupname" :  data.grpName} , (err, grp) => {
        
          if(!err) {
              socket.join(data.grpName); 
          }
      });
    });

    socket.on('sendGrpMessage', function(data) {
      console.log('From User & Group Name & Message : ' +data.fromUser+ ' ' +data.grpName+ ' ' +data.grpMessage);
      var grpMessage = data.grpMessage;
      group.findOne({ "groupname" :  data.grpName} , (err, grp) => {
          if(!err) {
              function updatereadby(){
                console.log("first loop");
                return new Promise((resolve,reject)=>{
                  var groupChatModel = new groupChat();
                  groupChatModel.fromUser = data.fromUser;
                  groupChatModel.group_id = grp._id;
                  groupChatModel.groupname = data.grpName;
                  groupChatModel.message = data.grpMessage;
                  groupChatModel.save(function(){
                    resolve({result:'success'});
                  });
                  io.sockets.in(data.grpName).emit('RoomMessage', data);
                  for(var i=0;i<data.groupmembers.length;i++){
                  console.log("groupmembers"+data.groupmembers[i]);
                  io.to(user_socket_id[data.groupmembers[i]]).emit('Groupnotificationcount', data);
                  }
                 
                })
              }

              return updatereadby().then(Response=>{
                console.log("second loop");
                var pushArray =[];
                  for(var i = 0;i<grp.groupmembers.length;i++){
                    console.log("members name"+grp.groupmembers[i].name);
                    console.log("online status"+grp.groupmembers[i].isonline);
                    if(grp.groupmembers[i].isonline == 1){
                     
                      groupChat.updateMany({
                        'group_id' : grp._id
                      },{
                        $addToSet:{
                          'readby' :grp.groupmembers[i].name
                        }
                      },{multi:true},function(err,success){
                        console.log("pushed name successfully");
                        console.log(success);
                      })
                    }
                  }
               })
             }
      });
  });

    /* create room for live stream */
    /* socket.on('createroomoflivestream',function(data){
      socket.join(data.loginpersonname);
    }) */
     /* send live streaming notification */
    socket.on('sendlivestreamnotification',function(data){
      console.log("friends names"+data.friends);
    
      for(var i = 0;i<data.friends.length;i++){
        io.to(user_socket_id[data.friends[i]]).emit('livestreamnotification',data);
      }
     
    });

 /*    socket.on('joinlivestream',function(data){
      console.log("joined success hurrey");
      socket.join(data.name);
      socket.emit('joinedsuccess',data);
    }) */

    /* live streaming */
    socket.on('stream',function(image, data){
    
       socket.broadcast.emit('stream',image); 
    
    });

    socket.on('sendVideoNotification',function(data){
      console.log("emit video request to"+data.toUser);
     io.to(user_socket_id[data.toUser]).emit('getVideoNotification',data);
    })

   

    /* one to one video call */
    socket.on('joinVideoRoom', function(room) {
            
      var sockeId;

      //Video Call Initiation
      socket.on('initiateVideoCall', function(data) {
          console.log("Reciever Username : " +data.toUser);
          sockeId = data.toUser;
          io.to(user_socket_id[data.toUser]).emit('readyForVideo', data.toUser); 
      });

      socket.on('offer', function (id, message) {
          console.log("ID TO USERR :" ,id)
          io.to(user_socket_id[sockeId]).emit('offer', sockeId, message);
      });

      socket.on('answer', function (id, message) {
          io.to(user_socket_id[sockeId]).emit('answer', sockeId, message);
      });
      
      socket.on('candidate', function (id, message) {
          io.to(user_socket_id[sockeId]).emit('candidate', sockeId, message);
      });

      socket.on('HangUp', function() {
          console.log("DISCONNECTED");
          io.to(user_socket_id[sockeId]).emit('bye', sockeId);
      });

      socket.on('DeniedCall', function() {
         /  console.log("Denie Call", +data.fromUser); /
          io.to(user_socket_id[newPerson]).emit('bye', newPerson);
      });
      
     /*  socket.on('disconnect', function() {
          socket.broadcast.to(room).emit('bye', socket.id);
          io.to(user_socket_id[sockeId]).emit('bye', room);
      }); */

      //Join Video Room
      socket.join(room);
   });

   /* live stream files */
      socket.emit('add-users', {
          users: sockets
      });

      socket.broadcast.emit('add-users', {
      
          users: [socket.id]
      }); 
      console.log("user sockets id "+JSON.stringify(socket.id));
      socket.on('make-offer', function(data) {
          socket.to(data.to).emit('offer-made', {
              offer: data.offer,
              socket: socket.id
          });
          console.log("make-offer id is "+socket.id);
      });

      socket.on('make-answer', function(data) {
          socket.to(data.to).emit('answer-made', {
              socket: socket.id,
              answer: data.answer
          });
      });

      socket.on('disconnect', function() {
          sockets.splice(sockets.indexOf(socket.id), 1);
          io.emit('remove-user', socket.id);
          sockets.pop(socket.id);
      });

      sockets.push(socket.id);

  });
}