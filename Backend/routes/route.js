const express = require("express");
const multer = require('multer');
const router = express.Router(); 
var upload = multer({ dest: 'public/' });

 var passport = require('../connection/passport');
var config = require('../connection/config'); 
var authController = require('../controller/authcontroller');
var userandfriendcontroller = require('../controller/user&friendcontroller');
var chatrequestcontroller = require('../controller/chatrequestcontroller');
var chatpagecontroller = require('../controller/chatpagecontroller');
var groupchatcontroller = require('../controller/groupchatcontroller');


/*get api of signup form */
router.get('/registration',authController.getsignup) ;

/*post api of signup form */
router.post('/save', upload.single('file'),authController.signup) ;

/* get api of login form */
router.get('/',authController.getlogin);

/*post api of login form */
router.post('/loginvalidation',authController.login);

/*get api for logout*/
router.get('/logout',authController.logout);

/*get api of userlist */
router.get('/userdata',passport.authenticate('jwt', ({session : false})),userandfriendcontroller.getUserdata);

/*get api of Friendlist */
router.get('/userfriendslist',passport.authenticate('jwt', ({session : false})),userandfriendcontroller.getFriendslist);

/*get api of modified user page */
router.get('/user',userandfriendcontroller.Modifieduserpage);

/*show status api */
router.get('/showstatus',passport.authenticate('jwt', ({session : false})),userandfriendcontroller.statusapi);

/*get api of chatrequest page*/
router.get('/chatrequestpage',chatrequestcontroller.chatrequestpage);

/*notification update api*/
router.post('/requestuserdata',passport.authenticate('jwt', ({session : false})),chatrequestcontroller.notificationapi);

/*Notification count api*/
router.post('/getNotificationCount',passport.authenticate('jwt', ({session : false})),chatrequestcontroller.notificationcountapi);

/*accept button api*/
router.post('/useraction',passport.authenticate('jwt', ({session : false})),chatrequestcontroller.acceptbuttonapi);

/*reject button api*/
router.post('/userrejectaction',passport.authenticate('jwt', ({session : false})),chatrequestcontroller.rejectbuttonapi);

/*open chatpage api */
router.get('/personalchatpage',chatpagecontroller.openchatpage);

/*show user message convo */
router.post('/userconvodata',passport.authenticate('jwt', ({session : false})),chatpagecontroller.Showuserconvo);

/*show message notification api */
router.post('/chatmessagerequest',passport.authenticate('jwt', ({session : false})),chatrequestcontroller.Showusermessagenotification);

/*get data of notifieduser api */
router.post('/getnotifiedpersondata',chatrequestcontroller.ShownotifiedUserdata);

/*get friends data api */
router.post('/getfriendsdata',passport.authenticate('jwt', ({session : false})),chatpagecontroller.getfriendsdata);

/*image download api*/
/* router.post('/imagedownload',chatpagecontroller.downloadimage); */
router.post('/signingoogle',authController.signingoogle);

/*on browsers tab close */
router.get('/ontabclose',userandfriendcontroller.ontabclose);

/* router.get('/auth/google/callback',
passport.authenticate('google', {scope : ['profile', 'email'] }),authController.signinwithgooglesuccess); */

/*create group api */
router.post('/usergroupdata',passport.authenticate('jwt', ({session : false})),groupchatcontroller.getgroupdata);

/*show users groups */
router.get('/showusergroups',passport.authenticate('jwt', ({session : false})),groupchatcontroller.getusergroups);

/*store data in group chat */
router.post('/opengroupchatpage',passport.authenticate('jwt', ({session : false})),groupchatcontroller.opengroupchatpage);

/*open group chat */
router.get('/groupchathtml',groupchatcontroller.openpage);

/*show group convo */
router.post("/groupchatconvo",passport.authenticate('jwt', ({session : false})),groupchatcontroller.showgroupconvo);

/*add group members  */
 router.post("/addgroupmember",passport.authenticate('jwt', ({session : false})),groupchatcontroller.addgroupmember);
 
 /*get user profile api */
 router.post("/getuserprofiledetails",passport.authenticate('jwt', ({session : false})),authController.getuserprofiledetails);

 /*update users profile */
 router.post("/updateprofile",passport.authenticate('jwt', ({session : false})),authController.updateuserprofile);

 /*leave group api */
 router.post("/leavegroup",passport.authenticate('jwt', ({session : false})),groupchatcontroller.leavegroup);

 /*show groupmembers list api */
 router.post("/groupmemberslist",passport.authenticate('jwt',({session : false})),groupchatcontroller.showgroupmemberslist);

 /* Kick member api */
 router.post("/kickmemberlist",passport.authenticate('jwt', ({session : false})),groupchatcontroller.kickmember);

 /*Make admin before exit api */
 router.post("/changeadmin",passport.authenticate('jwt',({session:false})),groupchatcontroller.makeadmin);

 /*update group info */
 router.post("/updategroupinfo",passport.authenticate('jwt', ({session : false})),groupchatcontroller.updategroupinfo);

 /* update user group online status */
 router.post("/updateuseronlinestatus",passport.authenticate('jwt',({session : false})),groupchatcontroller.updateonlinestatus);

 /*update user group status to offline */
 router.post("/updateuseronlinestatustooffline",passport.authenticate('jwt',({session:false})),groupchatcontroller.updateuserstatustooffline);

 /* get group notification count */
 router.get("/getgroupnotifcationcount",passport.authenticate('jwt',({session:false})),groupchatcontroller.getgroupnotification);
module.exports = router;