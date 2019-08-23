"use strict";

var socket = io.connect(baseUrl);

var answersFrom = {};
var offer, streamCustom;

var peerConnection = window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.msRTCPeerConnection;

var sessionDescription = window.RTCSessionDescription ||
    window.mozRTCSessionDescription ||
    window.webkitRTCSessionDescription ||
    window.msRTCSessionDescription;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

var pc = new peerConnection({
    iceServers: [{
        url: "stun:stun.services.mozilla.com",
        username: "somename",
        credential: "somecredentials"
    }]
});

pc.onaddstream = function(obj) {
   console.log('create_offer');
   console.log(obj);
    var vid = document.createElement('video');
    vid.setAttribute('class', 'video-small');
    vid.setAttribute('autoplay', 'autoplay');
    vid.setAttribute('id', 'video-small');
  //  document.getElementById('users-container').appendChild(vid);
  vid.srcObject = obj.stream;
  window.open().document.write(vid);
  };


    navigator.getUserMedia({ video: true }, function(stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        streamCustom = stream; 
        console.log(streamCustom);
        pc.addStream(streamCustom);
        notifyfriends();
    }, error);    

function error(err) {
    console.warn('Error', err);
}

function createOffer(id) {
    pc.createOffer(function(offer) {
        pc.setLocalDescription(new sessionDescription(offer), function() {
            /* console.log(streamCustom); */
            
            socket.emit('make-offer', {
                offer: offer,
                to: id
            });
        }, error);
    }, error);
}

/* Send notification to friends api call */
        function notifyfriends(){
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
            });
        }
        return getfriendlist().then(Response =>{
            var loginpersonid = localStorage.getItem("loginpersonid");
            var loginpersonname = localStorage.getItem("loginpersonname");
            console.log("new arrray is "+JSON.stringify(friendsarray));
        
            socket.emit('sendlivestreamnotification',{loginpersonid:loginpersonid,friends:friendsarray,loginpersonname:loginpersonname});
        });
   }

socket.on('answer-made', function(data) {
    pc.setRemoteDescription(new sessionDescription(data.answer), function() {
        document.getElementById(data.socket).setAttribute('class', 'active');
        if (!answersFrom[data.socket]) {
            createOffer(data.socket);
            answersFrom[data.socket] = true;
        }
    }, error);
});

socket.on('offer-made', function(data) {
    offer = data.offer;

    pc.setRemoteDescription(new sessionDescription(data.offer), function() {
        pc.createAnswer(function(answer) {
            console.log("checking of which event trigger on click ,now in offermde" );
            pc.setLocalDescription(new sessionDescription(answer), function() {
                console.log("answer is"+JSON.stringify(answer));
                socket.emit('make-answer', {
                    answer: answer,
                    to: data.socket
                });
            }, error);
        }, error);
    }, error);
});

socket.on('add-users', function(data) {
    console.log("checking of which event trigger on click ,now in add-users" +JSON.stringify(data));
    for (var i = 0; i < data.users.length; i++) {
        var el = document.createElement('div'),
            id = data.users[i];

        el.setAttribute('id', id);
        el.innerHTML = id;
        el.addEventListener('click', function() {
            createOffer(id);
          // console.log(baseUrl+'userWebrtclivestream.html?stream_socket_id='+id);
          // window.open(baseUrl+'userWebrtclivestream.html?stream_socket_id='+id, '_blank');
        });
        document.getElementById('users').appendChild(el);
    }
});

socket.on('remove-user', function(id) {
   if(id){
    var div = document.getElementById(id);
   /*  console.log(div); */
    if(div != null){
    document.getElementById('users').removeChild(div);
    }
 }

});