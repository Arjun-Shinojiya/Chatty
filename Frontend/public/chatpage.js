$(function(){

    var friendname = localStorage.getItem("friendname");
   
    var loginpersonname = localStorage.getItem("loginpersonname");
    var loginpersonid = localStorage.getItem("loginpersonid");
    var friendid = localStorage.getItem("friendid");
    console.log("Friend id is"+friendid);
    $('.box-title').html(" "+friendname);
    var friendimage = localStorage.getItem('friendimage'); 
    var token = localStorage.getItem("token");
    var loginpersonimage = localStorage.getItem('loginpersonimage');
    var image = $(this).find('.chatpageimage');
    image.attr('src',friendimage);

     var convodata = {
        friendname:friendname,
        loginpersonname:loginpersonname,
        loginpersonid:loginpersonid,
        friendid:friendid
    }

    /* Show previous chats */
    $.ajax({
        async: true,
        crossDomain: true,
        type: 'POST',
        url: baseUrl+'userconvodata',
        "headers": {
            "authorization": token,
        /*      "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
        },
        contentType: 'application/JSON',
        dataType: 'json',
        data:JSON.stringify(convodata),
        success: function (res) {
            console.log(res);
           
            for(var i = 0;i < res.length ; i++){
                var date = res[i].date;
              
               
                var momentdate = moment(date).format("MMMM Do, h:mm:ss a");
                console.log("moment date"+moment);
                console.log("message data"+res[i].message);
                if(res[i].image == null){
                if(res[i].fromuser == loginpersonid && res[i].touser == friendid){
                    var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><div class="direct-chat-text" id="message">'+res[i].message+'</div></div>'
                    $('.direct-chat-messages').append(ownmessage);
                }else{
                    var friendusermessage ='<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><div class="direct-chat-text" id="message">'+res[i].message+'</div></div>'
                    $('.direct-chat-messages').append(friendusermessage);
                }
              }
              else{
                var filename = res[i].image.replace(/^.*[\\\/]/, '')
                console.log("snvpsnvs"+filename);
                var fileextension = filename.split('.').pop();
                console.log("File extension"+fileextension);
                if(res[i].fromuser ==loginpersonid && res[i].touser == friendid){
                  if(fileextension == 'mp4' || fileextension == 'flv' || fileextension == 'avi'){
                    var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><video src="'+baseUrl+res[i].image+'" height="150px" width ="220px" style = "float : right;"  controls></video></div>'
                    $('.direct-chat-messages').append(ownmessage);
                  }else{
                    var ownmessage ='<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">'+momentdate+'</span></div><img src="'+baseUrl+res[i].image+'" height="150px" width ="150px" style = "float : right;"/></div>'
                    $('.direct-chat-messages').append(ownmessage);
                  }
                } else{
                    if(fileextension == 'mp4' || fileextension == 'flv' || fileextension == 'avi'){
                    var friendusermessage ='<div class="direct-chat-msg" id="imagecontainer"><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><a href="#" class="iconclass"><span  class="fa fa-download fa-3x"></span></a><video src="'+baseUrl+res[i].image+'" class="image" height="200px" width ="220px" controls></video></div>'
                    $('.direct-chat-messages').append(friendusermessage);
                }else{
                  var friendusermessage ='<div class="direct-chat-msg" id="imagecontainer"><div class="direct-chat-info clearfix"><span class="direct-chat-timestamp pull-right">'+momentdate+'</span></div><a href="#" id="iconid"><span  class="fa fa-download fa-3x"></span></a><img src="'+baseUrl+res[i].image+'" class="image" height="150px" width ="150px"/></div>'
                  $('.direct-chat-messages').append(friendusermessage);
                }
              }
              }
            }
         },
        error: function (jqXHR, textStatus, err) {
          console.log('Ajax repsponse:', textStatus);
         
        }
      });

     /* image download function */
      $(document).on('click','#iconid',function(){
       var imagepath =  $(this).parent().parent().find('img').attr('src');
       console.log(imagepath);
        var file_path = imagepath;
        var a = document.createElement('A');
        a.href = file_path;
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
     })

     /*video download function */
      $(document).on('click','.iconclass',function(){
        var videpath =  $(this).parent().parent().find('video').attr('src');
        console.log(videpath);
         var file_path = videpath;
         var a = document.createElement('A');
         a.href = file_path;
         a.download = file_path.substr(file_path.lastIndexOf('/') + 1);
         document.body.appendChild(a);
         a.click();
         document.body.removeChild(a);
      })
  });
     
  