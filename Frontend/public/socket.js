$(function () {
    var socket = io();
    var loginperson = localStorage.getItem("loginpersonname");
    var grpName = localStorage.getItem("groupname");
    $('body').attr('user-id', loginperson);
    var socket = io.connect(baseUrl, { secure: false });
    socket.emit('join', { user_id: $('body').attr('user-id') });
    socket.emit('create', {
      grpName : grpName,
      room : 'room'
  });
  
  /*send friend request socket */
    var x;
    $("#alluser").on('click', 'button.requeststatus', function () {
      var loginpersonid= localStorage.getItem("loginpersonid");
        var element = $(this).prev().prev();
      console.log("button click"+element);
        x = element.html();
        console.log("x value is" + x);
        console.log(x.replace(/ /g, '_'));
        socket.emit('send_chat_request', {
            'chat_user_id': x.replace(/ /g, '_'),
            'req_user_id': loginpersonid
        });
      $(this).prop("disabled", "disabled");
      $(this).css({"cursor": "not-allowed","opacity":".65"})
    });
   
    var i = 0;
    socket.on('receive_chat_request', function (data) {
       
        console.log("userdata is" + data.chat_user_id);
        i++;
        $("#notificationcount").html(i);
    });

    /*group notification count api */
  
    socket.on('Groupnotificationcount',function(data){
       console.log("socket notification data"+JSON.stringify(data));
     
       
        var groupnamehtml = $('.usergroups');
      
        $("li .groupname").each(function(index){
          console.log("group name "+$(this).html());
          var liname = $(this).html();
          console.log("liname"+liname)
          if(liname == data.grpName){
           
          
          console.log($(this).next().html());
         var t = $(this).next().html();
         var k = parseInt(t) + 1;
         console.log("k value"+k);
         $(this).next().html(""+k);
          //$('#groupmessagecount').html(i);
         
           }
          else{
            console.log("nothing to show");
          }
        });
      /* console.log($('.usergroups').find('h6').val(groupname)); */
      /*  $('#groupmessagecount').html(i);  */
    });


    socket.on('already_friend', function (data) {
        alert("You already sent request to "+data.chat_user_id);
    });

    var message = $('#message');
    var inputbox = $('#inputbox');

    $('#inputbox').keyup(function(event){
        if (event.keyCode === 13) {
          
      
         $("#btnsend").click();
         $('#inputbox').val('');
        }
     });

     $("#inputbox").emojioneArea({
        pickerPosition: "top",
        tonesStyle: "bullet",
        events: {
            keyup: function (editor, event) {
           
                console.log("text"+this.getText());
            
            }
        } 
    });
   
    /*1-1 chat message socket */
    var friend;
     var date;
     var momentdate;
    $('#btnsend').click(()=>{
        var loginpersonname =  localStorage.getItem('loginpersonname');
        var loginimage = localStorage.getItem('loginpersonimage');
        var loginpersonid = localStorage.getItem('loginpersonid');
        var friendid = localStorage.getItem('friendid');

         date = new Date();
        momentdate = moment(date).format("MMMM Do, h:mm:ss a");
        $('#inputbox').data("emojioneArea").getText();
        console.log("inputbox value"+inputbox.val());
          friend = localStorage.getItem('friendname');
         var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><div class="direct-chat-text" id="message">'+inputbox.val()+'</div></div>'
         $('.direct-chat-messages').append(ownmessage);
          socket.emit('message',{message : inputbox.val(),fromuser : loginpersonname,touser : friend,loginimage : loginimage,loginpersonid:loginpersonid,friendid:friendid});
          inputbox.val("");
          inputbox.data("emojioneArea").setText('');
        
      });
      var i =0;
      socket.on('messages',(data)=>{
          console.log("friends name"+friend);
          console.log("data first looop"+data.fromuser);
          if(data.fromuser != friend){
            
            i++;
            $("#notificationcount").html(i);
          
          }else{
            momentdate = moment(date).format("MMMM Do, h:mm:ss a");
            var friendusermessage ='<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data.fromuser+'</span><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><div class="direct-chat-text" id="message">'+data.message+'</div></div>'
            $('.direct-chat-messages').append(friendusermessage);
          }
       
      });
      friend = localStorage.getItem('friendname');
      var loginpersonname =  localStorage.getItem('loginpersonname');
      var loginimage = localStorage.getItem('loginpersonimage');
      var loginpersonid = localStorage.getItem('loginpersonid');
      var friendid = localStorage.getItem('friendid');
      date = new Date();
       momentdate = moment(date).format("MMMM Do, h:mm:ss a");

       $('.icon').click(()=>{
           $("#imagefile").click();
       })
    
       /*image send and receive socket */
      $('#imagefile').on('change', function(e){
            const files = e.currentTarget.files;
            if(files.length <=5){
            Object.keys(files).forEach(i => {
              const file = files[i];
               const reader = new FileReader();
              reader.onload = (e) => {
                //server call for uploading or reading the files one-by-one
                //by using 'reader.result' or 'file'
              
                var fileextension = file.name.split('.').pop();
                console.log(file);
                console.log(file.name);
               console.log(fileextension);
               if (fileextension == 'mp4' || fileextension == 'flv' || fileextension == 'avi'){
                var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><video src="'+reader.result+'" height="150px" width ="220px" style = "float : right;" controls></video></div>'
                $('.direct-chat-messages').append(ownmessage);

                socket.emit('user image', {image :reader.result,touser:friend,fromuser : loginpersonname,imagename:file.name,loginpersonid:loginpersonid,friendid:friendid});
               }else{
               
                var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><img src="'+reader.result+'" height="150px" width ="150px" style = "float : right;"/></div>'
                $('.direct-chat-messages').append(ownmessage);

                socket.emit('user image', {image :reader.result,touser:friend,fromuser : loginpersonname,imagename:file.name,loginpersonid:loginpersonid,friendid:friendid});
               }
                   
              
              }
              reader.readAsDataURL(file);
              
            })
          
        }else{
            alert("Can't Send More than 5 image at a time");
        }
    });

     socket.on('user image', image);
      friend = localStorage.getItem('friendname');
     var i = 0;
      function image (from, base64Image) {
        
          console.log("image"+from.image);
          console.log("imagename"+from.imagename);
          var fileextension = from.imagename.split('.').pop();
          console.log("fileextensionnn"+fileextension);
          if (fileextension == 'mp4' || fileextension == 'flv' || fileextension == 'avi'){
            var friendusermessage ='<div class="direct-chat-msg" id="imagecontainer"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+from.fromuser+'</span><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><a href="#" id="iconid"><span  class="fa fa-download fa-3x"></span></a><video src="'+from.image+'" class="image" height="150px" width ="220px" controls></video></div>'
            $('.direct-chat-messages').append(friendusermessage);
          }else{
            var friendusermessage ='<div class="direct-chat-msg" id="imagecontainer"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+from.fromuser+'</span><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><a href="#" id="iconid"><span  class="fa fa-download fa-3x"></span></a><img src="'+from.image+'" class="image" height="150px" width ="150px"/></div>'
            $('.direct-chat-messages').append(friendusermessage);
          }
        }
       
/* Group socket */
$("#sendGrpMessage").click(function(){
  Array.prototype.remove = function (elem) {
    var indexElement = this.findIndex(el => el === elem);
    if (indexElement != -1)
      this.splice(indexElement, 1);
    return this;
  };

  var grouparray = [];
  var grpMessage = $('.grpMessage').val();
  var loggedUserName = localStorage.getItem('loginpersonname');
  var grpName = localStorage.getItem("groupname");
  var groupmembers = localStorage.getItem("groupmembers");
  grouparray=groupmembers.split(',');
  
  myDate = new Date();
  momentdate = moment(date).format("MMMM Do, h:mm:ss a");
 
  var grpFromUserMessage = '<div class="direct-chat-msg right fromUser"><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><div class="direct-chat-text">'+grpMessage+'</div></div>';

  $('.direct-chat-messages').append(grpFromUserMessage);

  if(grpMessage != '') {
      socket.emit('sendGrpMessage', {
          fromUser : loggedUserName,
          groupmembers : grouparray,
          grpName : grpName,
          grpMessage : grpMessage,
      });
  }
});

socket.on('RoomMessage', (data)=>{
  console.log('data : ' +data.fromUser);
  var loggedUserName = localStorage.getItem('loginpersonname');
  if(data.fromUser == loggedUserName){
      $('.direct-chat-messages').append();
  } else {
      myDate = new Date();
      momentdate = moment(myDate).format("MMMM Do, h:mm:ss a");

      var grpMessageDiv = '<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">'+data.fromUser+'</span><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><div class="direct-chat-text">'+data.grpMessage+'</div></div>';

      $('.direct-chat-messages').append(grpMessageDiv);
  }
});


/* livestream notifcation  */
socket.on('livestreamnotification',(data)=>{
  /* alert(data.loginpersonname+ "is live now ,click here to watch live stream"); */
  swal({
    title: "Live Stream!!",
    text: data.loginpersonname+' is live now ,click here to watch live stream',
    type: "success",
    buttons:["Cancel","Lets go!"]  
  })
  .then((isconfirm) => {
    if (isconfirm) {
    
       window.location.href = baseUrl+'webrtclivestream.html'; 
    }
  });
 });

 /* videocall one to one */
 const localVideo = document.querySelector('.localVideo');
    const remoteVideos = document.querySelector('.remoteVideos');
    var loggedUserName = localStorage.getItem("loginpersonname");
    var friendName = localStorage.getItem("friendname");
    const peerConnections = {};
    let getUserMediaAttempts = 5;
    let gettingUserMedia = false;
    let room = !location.pathname.substring(1) ? 'home' : location.pathname.substring(1);
    var loalStream;

    const config = {
        'iceServers': [{
          'urls': ['stun:stun.l.google.com:19302']
        }]
    };

    const constraints = {
        //audio: true,
        video: { facingMode: "user" }
    };

    socket.on('full', function(room) {
        alert('Room ' + room + ' is full');
    });

    //Sending Video call notification to receiver
    $('.videoCall').click(function(){
     console.log(loggedUserName);
     console.log(friendName);
        socket.emit('sendVideoNotification', {
            fromUser : loggedUserName,
            toUser : friendName
        });
    });

    //Get Video call notification from callee
    socket.on('getVideoNotification', (data) => {
        var fromUser = data.fromUser;
        console.log("swallll"+fromUser);
        swal({
            title: data.fromUser+ ' is calling you.',
            buttons: ['End', 'Receive'],
            closeOnClickOutside: false
          }).then((isConfirm) => {
            if (isConfirm) {
              window.location = baseUrl+'videocall.html';
            } else{
                console.log(data.fromUser);
                socket.emit('DeniedCall');        
            }
        });
    });

    $("#hangUp").click(function(){
        socket.emit('HangUp');
        window.location =  baseUrl+'personalchatpage';
    });
    
    socket.on('bye', function(id) {
        alert(id+ " has cut your call");
        handleRemoteHangup(id); 
    });

    if (room && !!room) {
        socket.emit('joinVideoRoom', room);
    }

    window.onunload = window.onbeforeunload = function() {
        socket.close();
    };

    socket.on('readyForVideo', function (id) {
        if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
            return;
        }
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;
        if (localVideo instanceof HTMLVideoElement) {
            peerConnection.addStream(localVideo.srcObject);
        }
        peerConnection.createOffer()
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
            socket.emit('offer', id, peerConnection.localDescription);
        });
        peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {
                socket.emit('candidate', id, event.candidate);
            }
        };
    });

    socket.on('offer', function(id, description) {
        const peerConnection = new RTCPeerConnection(config);
        peerConnections[id] = peerConnection;
        if (localVideo instanceof HTMLVideoElement) {
        peerConnection.addStream(localVideo.srcObject);
        }
        peerConnection.setRemoteDescription(description)
        .then(() => peerConnection.createAnswer())
        .then(sdp => peerConnection.setLocalDescription(sdp))
        .then(function () {
        socket.emit('answer', id, peerConnection.localDescription);
        });
        peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
        peerConnection.onicecandidate = function(event) {
            if (event.candidate) {       
                socket.emit('candidate', id, event.candidate);
            }
        };
    });

    socket.on('candidate', function(id, candidate) {
        peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
        .catch(e => console.error(e));
    });

    socket.on('answer', function(id, description) {
        peerConnections[id].setRemoteDescription(description);
    });

    function getUserMediaSuccess(stream) {
        gettingUserMedia = false;
        loalStream = stream;
        if (localVideo instanceof HTMLVideoElement) {
            !localVideo.srcObject && (localVideo.srcObject = stream);
        }
      
        socket.emit('initiateVideoCall', {
            toUser : friendName
        });
    }

    $('.holdCall').click(function(){
        console.log(loalStream.getVideoTracks());
        / loalStream.stop(); /
        loalStream.getTracks().forEach(track => track.stop())
    })

   /*  $('.resumeCall').click(function(){
        getUserMediaSuccess(loalStream);
    }) */

    function handleRemoteStreamAdded(stream, id) {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = stream;
        remoteVideo.setAttribute("id", id.replace(/[^a-zA-Z]+/g, "").toLowerCase());
        remoteVideo.setAttribute("playsinline", "true");
        remoteVideo.setAttribute("autoplay", "true");
        remoteVideos.appendChild(remoteVideo);

        if (remoteVideos.querySelectorAll("video").length === 1) {
        remoteVideos.setAttribute("class", "one remoteVideos");
        } else {
        remoteVideos.setAttribute("class", "remoteVideos");
        }
    }

    function getUserMediaError(error) {
        console.error(error);
        gettingUserMedia = false;
        (--getUserMediaAttempts > 0) && setTimeout(getUserMediaDevices, 1000);
    }

    function getUserMediaDevices() {
        if (localVideo instanceof HTMLVideoElement) {
        if (localVideo.srcObject) {
            getUserMediaSuccess(localVideo.srcObject);
        } else if (!gettingUserMedia && !localVideo.srcObject) {
            gettingUserMedia = true;
            navigator.mediaDevices.getUserMedia(constraints)
            .then(getUserMediaSuccess)
            .catch(getUserMediaError);
        }
        }
    }

    function handleRemoteHangup(id) {
        console.log("Hello", id);
        peerConnections[id] && peerConnections[id].close();
        delete peerConnections[id];
       
        if (remoteVideos.querySelectorAll("video").length === 1) {
        remoteVideos.setAttribute("class", "one remoteVideos");
        } else {
        remoteVideos.setAttribute("class", "remoteVideos");
        }
        window.location = baseUrl+'personalchatpage';
    }

    getUserMediaDevices();


    


});

  