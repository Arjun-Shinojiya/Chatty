const express = require("express");
const fs = require('fs');
var sess;
var group = require('../modals/groupchat');
var user = require('../modals/user');
var groupmessage = require('../modals/groupchatmodal');
var path = require('path');


/*save group data */
exports.getgroupdata = (req,res) =>{
    sess = req.session;
   
    var groupname = req.body.groupname;
    var groupmembers = req.body.groupmember;
    var loginid = req.body.loginpersonid;
   
    group.findOne({'groupname' : groupname},function(err,result){
       console.log("result group"+JSON.stringify(result));
        if(result){
            console.log("firstgroup");
            res.json({fail:'groupexist'});
        }else{
        
        function saveandupdate(){
            return new Promise((resolve,reject) =>{
                console.log("groupname"+groupname);
                var groupdata = new group();
                groupdata.groupname = groupname;
                groupdata.createdby = sess._id;
                groupdata.admin = sess._id;
                groupdata.save(function(err,result){
                    resolve({result:'success'});
                });
            })
        }
            return saveandupdate().then(Response =>{
                for(var i =0;i<groupmembers.length;i++){
                    group.update({
                        'groupname':groupname
                    },{
                        $push:{
                            'groupmembers':{
                                'name' :groupmembers[i],
                                'isonline' : false,
                            }
                        }
                    },{
                        multi:true
                    },function(err,success){
                        console.log(success);
                    })
                }
               
               res.json({success:'Group created'});
            });
        }
    }); 
}

/*show users groups */
exports.getusergroups = (req,res) =>{
    sess = req.session;
    group.find( { $or: [{ "groupmembers" : {$elemMatch:{ "name" : sess.name } }}, {"admin":sess._id } ] },function(err,result){
       console.log("usergroup"+JSON.stringify(result));
            res.send(result);
    });
}

/* getgroupnotification count */
exports.getgroupnotification = (req,res)=>{
    sess = req.session;
    var array=[];
    var idarray =[];
    group.find({ $or: [{ "groupmembers" : {$elemMatch:{ "name" : sess.name } }}, {"admin":sess._id } ] },function(err,result){
        function pushnameandlength(){
            return new Promise((resolve,reject)=>{
                for(var i =0;i<result.length;i++){
                    idarray.push(result[i]._id);
                }
                console.log("idarray",idarray);
                    groupmessage.find({$and:[{'group_id':idarray},{'readby':{$nin:[sess.name]}}]},function(err,result1){
                        
                        console.log("result  lemgth"+result1.length);
                        for(var j=0;j<result1.length;j++){ 
                           
                           array.push(result1[j].groupname);         
                        }
                       
                        resolve({result:'success'}); 
                     })
                })
        }
        
        return pushnameandlength().then(Response=>{
            console.log("array check "+JSON.stringify(array));
            res.send(array);
        }) 
    });
}

exports.opengroupchatpage =(req,res) =>{
    sess = req.session;
    console.log("group name in open group page"+req.body.groupname);
    group.find({'groupname':req.body.groupname},function(err,result){
        groupmessage.updateMany({
            'groupname' :req.body.groupname
          },{
            $addToSet:{
              'readby' :sess.name
            }
          },{multi:true},function(err,success){
           
            console.log(success);
          })
        res.send(result);
    })
}

exports.openpage =(req,res)=>{
    res.sendFile(path.resolve('../Frontend/groupchat.html'));
}

/*show group convo */
exports.showgroupconvo = (req,res)=>{
    sess = req.session
    groupmessage.find({"group_id":req.body.groupid},function(err,result){
        console.log(JSON.stringify(result));
       res.send(result);
    })
}

/*add group member api */
exports.addgroupmember = (req,res)=>{
    var groupmember = req.body.newmember;
    console.log("new member name"+groupmember);
    group.find({"_id":req.body.groupid},function(err,result){
        console.log("add members result"+result);
        for(var i =0;i<groupmember.length;i++){
            group.update({
                '_id':req.body.groupid
              },
                {
                  $push : {
                    'groupmembers'   : {
                        'name' : groupmember[i],
                        'isonline' : false
                    } 
                  }
                },{
                  multi:true
                },function(err,result){
                    console.log("member is successfullty inserted in group")
                   
                });
        }
        res.send(groupmember);
      
     })
    
}


/*exitgroup api */
exports.leavegroup = (req,res)=>{
   sess = req.session;
    group.find({"_id":req.body.groupid},function(err,result){
        if(result[0].admin == sess._id){
            res.json({fail:"cantleave"})
        }else{
        group.update({
            '_id':req.body.groupid
        },{
            $pull:{
                'groupmembers' : {
                    'name' : req.body.loginpersonname,
                } 
            }
        },function(err,result1){
            console.log("member is removed successfully")
            res.send(result);
        });
      }
    })
}

/*show groupmebers list api */
exports.showgroupmemberslist = (req,res)=>{
    sess = req.session;
    var  groupmembers = req.body.groupmembers;
    console.log("groupmembers"+groupmembers);
    user.find(  { name: groupmembers }  ,function(err,result){
     res.send(result);
    })
}

exports.kickmember = (req,res)=>{
    sess= req.session;
   
    kickmember = req.body.kickmember;
  for(var i = 0;i<kickmember.length;i++){
    console.log("kick"+kickmember);
    group.update({
        '_id':req.body.groupid,
       },{
        $pull:{
            'groupmembers' : {
                'name' : kickmember[i]
            }
        },
    },{
        multi:true
    },function(err,result1){
            console.log("member is removed successfully from group")
            console.log(result1);
            res.send(result1);
        });
     }
}

exports.makeadmin = (req,res)=>{
    sess = req.session;
    var admin = req.body.admin;
   console.log("admin name"+admin);
   
    console.log("admin name"+admin);
    user.find({"name":admin},function(err,result){
        console.log("result value",JSON.stringify(result));
        group.update({
            '_id':req.body.groupid
        },{
            $set:{
                'admin':result[0]._id
            },
           
        },function(err,result1){
            console.log("update  done successfully")
            console.log(result1);
        });
        group.update({
            '_id':req.body.groupid
        },{
           
            $pull:{
                'groupmembers':{
                    'name' : sess.name
                }
            },
        },function(err,result2){
            console.log(" deletation done successfully")
            console.log(result2);
            res.send(result2);
        })
    });
}

exports.updategroupinfo = (req,res)=>{
   group.update({
       "_id":req.body.groupid
   },{
       $set:{
           'groupname':req.body.newgroupname
       }
   },function(err,result1){
       console.log(result1);
       res.send(result1);
   });

   groupmessage.update({
       'group_id':req.body.groupid
   },{
       $set:{
           'groupname':req.body.newgroupname
       }
   },{multi:true},function(err,result2){
    console.log(result2);
   })
}

/*update user online status */
exports.updateonlinestatus = (req,res)=>{
    sess = req.session;
    group.update({
        "_id":req.body.groupid,
        "groupmembers.name" :sess.name
    },{
        $set:{
            'groupmembers.$.isonline': true
          }
    },function(err,success){
        console.log(success);
        res.send(success);
    });
}

/*update user group status to offline */
exports.updateuserstatustooffline = (req,res)=>{
    sess = req.session;
    group.update({
        "groupmembers.name" :sess.name
       },{
         $set:{
             'groupmembers.$.isonline': false
           }
       },{multi:true},function(err,success){
         console.log(success);
         res.send(success);
     });
}