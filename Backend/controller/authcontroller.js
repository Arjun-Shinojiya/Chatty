const express = require("express");
const fs = require('fs');
var user = {};
var user = require('../modals/user');
var path = require('path');
var app = express();
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var ejs = require('ejs');
var config = require('../connection/config');
var store = require('store');
var Promise = require('promise');

var sess;

/*Signup Api */
exports.getsignup = (req,res)=>{
    res.sendFile(path.resolve('../Frontend/form.html'));
}

/*Signup Api */
var pwd;
exports.signup = (req,res)=>{
  user.findOne({email:req.body.email},function(err,result){
    if(result){
     console.log("Email id is already been registered");
      res.send('fail');
    }else{
      {
        var fileName = req.file.originalname;
        var file = path.resolve('D:/ChatappGit/Backend/assets/'+fileName);
        console.log("filename is" + file);
        let myCropImg = req.body.imagecrop.replace(/^data:([A-Za-z-+/]+);base64,/, "");
        
        fs.writeFile(file, myCropImg, 'base64', function (err) {
          if (err) {
            console.log('cropper base64 error')
            console.log(err);
          } else {
            bcrypt.hash(req.body.pass, 10, function(err, hash) {
              if(err) {
                 console.log(err);
              } else{
                pwd = hash;
               
                var model = new user();
                model.img = fileName,
                  model.name = req.body.name,
                  model.email = req.body.email,
                  model.lastname = req.body.lastname,
                  model.pass = pwd,
                  model.phonenumber = req.body.phonenumber,
                  model.zipcode = req.body.zipcode,
                  model.birthdate = req.body.birthdate,
                  model.username = req.body.username,
                  model.isonline = false,

                  model.save(function (err, doc) {
          
                  });
                res.json({
                  message: 'File uploaded successfully'
                });
              }
             
             
          });
           
          }
        });
    }
    }
  })
   
}

/*Login Api*/
exports.getlogin = (req, res) => {
 /*  res.header('Cache-Control', 'no-cache'); */
    sess=req.session;
    if(sess._id == undefined)
    {
      res.sendFile(path.resolve('../Frontend/login.html'));
    }
    else
    {
      res.sendFile(path.resolve('../Frontend/modifieduser.html'));
    }
};

/*Login Api*/
  exports.login = (req, res) => {
    sess = req.session;
    user.findOne({ "email" : req.body.username }, ( err, user1 ) => {
      if(err) return err;

      if(!user1) {
          res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
      } else {
          console.log(user1);
          var passwordIsValid = bcrypt.compareSync(req.body.password, user1.pass);
          if (!passwordIsValid) {
              return res.status(401).send({ 
                  status: 0, 
                  message: "Invalid password!" 
              });
          }
          sess._id = user1._id;
          sess.name = user1.name;
          console.log("id is : " +sess._id)
          console.log("name is" +sess.name);
          var token = jwt.sign({ id: user1.id }, config.secret, {
            expiresIn: 3600 // expires in 1 hours
          });
          console.log(token);
        
          res.json({success: true, token: 'jwt ' + token, data: user1});
        
      }
      
  });
  
};

/*Google sign in */
exports.signingoogle = (req,res)=>{
  sess = req.session;
  console.log("googleusername" +req.body.googlename);
  user.findOne({ 'googleid' : req.body.googleid }, function(err, user2){
   
    if (user2) {
      var token = jwt.sign({ id: user2.id }, config.secret, {
        expiresIn: 3600 // expires in 1 hours
      });
      sess._id = user2._id;
      sess.name = user2.name;
     console.log("already user available"); // if a user is found, log them in
     res.json({success: true, token: 'jwt ' + token, data: user2});
    }
    else{
      function checksave(){
        return new Promise((resolve,reject)=>{
          console.log("First loop");
          var user1 = new user();
          user1.googleid    = req.body.googleid;
          user1.name  = req.body.googlename; 
          user1.email = req.body.googleemail; 
          user1.username = req.body.googlename;
          user1.isonline = false;
          user1.img = req.body.googleimage;
          user1.save(function(err,result){
            if(result){
              resolve({result:'success'});
            }
          });
        });
      }

      return checksave().then(Response =>{
       
        console.log("Second loop");
        user.find({'googleid':req.body.googleid},(err,doc)=>{
          var token = jwt.sign({ id: doc.id }, config.secret, {
            expiresIn: 3600 // expires in 1 hours
          });
          console.log("Then loops sucess doc",JSON.stringify(doc));
          sess._id = doc[0]._id;
          sess.name = doc[0].name;
          console.log("sess id of then loop",sess._id);
          res.json({success: true, token: 'jwt ' + token, data: doc});
        })
      }).catch(err =>{
        console.log("catch error" + err);
    });
     }
   });
}



/*Logout button api */
exports.logout = (req,res)=>{
  sess = req.session
    
    user.update({
      '_id':sess._id
    },
      {
        $set : {
              
              'isonline'  : false
        }
      },{
        multi:true
      },function(err,result){
        console.log("successfully changed user read status");
      });
    req.session.destroy();
    store.clearAll();
    res.json({result:'success'});
    
  };


  /*get user profiledetails api */
  exports.getuserprofiledetails = (req,res)=>{
    user.findOne({"_id":req.body.loginpersonid},function(err,result){
      console.log("result of user profile"+JSON.stringify(result));
      res.send(result);
    })
  }

  /*update user profile api */
  exports.updateuserprofile = (req,res)=>{
    sess =req.session;
    
      if(req.body.img == "" && req.body.filename == ""){
        user.update({
          '_id':sess._id
        },
          {
            $set : {
          
              'email' : req.body.email,
              'username':req.body.name,
              'lastname':req.body.lastname,
              'birthdate':req.body.birthdate,
              'phonenumber':req.body.phonenumber
            }
          },function(err,result){
            if(result){
            res.json({
              message: 'Profile Updated successfully'
            });
          }
        });
      }
        else
      {
        var fileName = req.body.filename;
        var file = path.resolve('D:/ChatappGit/Backend/assets/'+fileName);
        console.log("filename is in update profile activity" + file);
        let myCropImg = req.body.img.replace(/^data:([A-Za-z-+/]+);base64,/, "");
        
        fs.writeFile(file, myCropImg, 'base64', function (err) {
          if (err) {
            console.log('cropper base64 error')
            console.log(err);
          } else {
         
           user.update({
            '_id':sess._id
          },
            {
              $set : {
                
                'img' : fileName,
                'email' : req.body.email,
                'username':req.body.name,
                'lastname':req.body.lastname,
                'birthdate':req.body.birthdate,
                'phonenumber':req.body.phonenumber
              }
            },function(err,result){
              if(result){
              res.json({
                message: 'Profile Updated successfully'
              });
            }
             });
            }
        });
    
      }
     
  }