var loginpersonname = localStorage.getItem('loginpersonname');
var canvas = document.getElementById('preview');
var context = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;
context.width = canvas.width;
context.height = canvas.height;

var video = document.getElementById('video');

var socket = io();

socket.emit('createroomoflivestream', {
    roomname : loginpersonname,
    room : 'room'
});
function loadCam(stream){
    video.srcObject=stream;
    console.log("camera good to response");
}
function loadFail(){
    console.log("camera failed to repsonse");
}
function viewVideo(video,context){
    context.drawImage(video,0,0,context.width,context.height);
    socket.emit('stream',canvas.toDataURL('image/webp'),{loginpersonname:loginpersonname});
}

$(function(){

    if(!location.hash.replace('#', '').length) {
        location.href = location.href.split('#')[0] + '#' + (Math.random() * 100).toString().replace('.', '');
        location.reload();
    }
    var hash = location.hash.substr(1);
    console.log("hash value"+hash);
    var token = localStorage.getItem("token");
    var friendsarray = [];
function getfriendlist(){
    return new Promise((resolve,reject)=>{

        $.ajax({
            type:'GET',
            async: true,
            crossDomain:true,
            url:baseUrl+'userfriendslist',
            "headers": {
              "authorization": token,
              /* "Content-Type": "application/x-www-form-urlencoded",  */
              "cache-control": "no-cache",
            },
            contentType:"application/JSON",
            dataType:'json',
            success : function(res){ 
             
              for (var i = 0; i < res.length; i++) {
                    console.log("Friend name: " + res[i][0].name);
                    var name = res[i][0].name;
                    friendsarray.push(name);
                    console.log("friends array is "+JSON.stringify(friendsarray));
                 }
                 resolve({result:'success'});
            },
            error: function (jqXHR, textStatus, err) {
              console.log('Ajax repsponse:', textStatus);
             }
          }); 
    })
}
return getfriendlist().then(Response =>{
    var loginpersonid = localStorage.getItem("loginpersonid");
    var loginpersonname = localStorage.getItem("loginpersonname");
    console.log("new arrray is "+JSON.stringify(friendsarray));
   
    socket.emit('sendlivestreamnotification',{loginpersonid:loginpersonid,friends:friendsarray,loginpersonname:loginpersonname});
    navigator.getUserMedia = (navigator.getUserMedia||navigator.msgGetUserMedia);
    if(navigator.getUserMedia){
        navigator.getUserMedia({video:true,audio:true},loadCam,loadFail);
    }
    setInterval(function(){
            viewVideo(video,context);
    },70);
});


     

  
});