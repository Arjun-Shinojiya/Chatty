$(window).load(function(){
    var name = localStorage.getItem("loginpersonname");
    var image = localStorage.getItem("loginpersonimage");
    var friendname = localStorage.getItem("friendname");
    var token = localStorage.getItem("token");
    $('.username').html(name);
    $('.hidden-xs').html(name);
    $('.insideprofilename').html(name);
    $('.user-image').attr('src',image);
    $('.img-circle').attr('src',image);
  
   
   /*friend request list api */
     $.ajax({
        async: true,
        crossDomain:true,
        type:'POST',
        url:baseUrl+'requestuserdata',
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
          },
        contentType: 'application/JSON',
       success : function(res){
           var string;
           console.log(res);
           for(var i=0;i<res.length;i++){
           console.log("notification response"+res[i]);
           console.log("userdata"+res[i].name);
           string ='<li class="requestedusers"><img src="'+baseUrl+res[i].img+'" class="listimage"><span class="listname">'+res[i].name+'</span><i class="fa fa-check-circle righttick"></i><i class="fa fa-times-circle wrongtick"></i></li>'
           $('#myList').append(string);
           
          /*  $("#notificationcount").html(i+1);  */
           $('.rolldown-list li').each(function () {
            var delay = ($(this).index() / 4) + 's';
            $(this).css({
              webkitAnimationDelay: delay,
              mozAnimationDelay: delay,
              animationDelay: delay
            });
          });
         } 
        },
         error : function(jqXHR, textStatus, err){
             console.log('Ajax repsponse:',textStatus);
             var mkConfig = {
                positionY: 'bottom',
                positionX: 'right',
                max: 5,
                scrollable: true
              };
            
              mkNotifications(mkConfig);
            
              mkNoti(
                'ChatrequestPage Response',
                'Something went wrong!',
                {
                  status:'danger',
                  dismissable :true,
                  duration:5000,
                }
              );
         } 
    });

    /* message request list api */
    var messagepost = {
        name:name,
        friendname:friendname
    }

    /* sent message notification api */ 
    $.ajax({
        async: true,
        crossDomain:true,
        type:'POST',
        url:baseUrl+'chatmessagerequest',
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
        },
        contentType:'application/JSON',
        dataType:'json',
        data:JSON.stringify(messagepost),
        success : function(res){
            
            for(var i =0;i<res.length;i++){
                console.log("message api response"+res[i]);
                string ='<li class="requestedusers" id="messagnotifyuser" style="cursor:pointer;"><img src="'+baseUrl+res[i].img+'" class="listimage"><span class="listname">'+res[i].name+'</span><span class="behindlistname">send you message</span>'
           $('#messageList').append(string);
           $('.rolldown-list li').each(function () {
            var delay = ($(this).index() / 4) + 's';
            $(this).css({
              webkitAnimationDelay: delay,
              mozAnimationDelay: delay,
              animationDelay: delay
            });
          });

            }
        },
        error : function(jqXHR, textStatus, err){
            console.log('Ajax repsponse:',textStatus);
            var mkConfig = {
                positionY: 'bottom',
                positionX: 'right',
                max: 5,
                scrollable: true
              };
            
              mkNotifications(mkConfig);
            
              mkNoti(
                'ChatrequestPage Response',
                'Something went wrong!',
                {
                  status:'danger',
                  dismissable :true,
                  duration:5000,
                }
              );
        } 
    });
 
    /*msg click api */
    $(document).on('click','#messagnotifyuser',function(){
        var notifiedpersonname= $(this).find('span').html();
       
        console.log(notifiedperson);
        $(this).parent().remove(); 
        var notifiedperson = {notifiedpersonname:notifiedpersonname}
        $.ajax({
            async: true,
            crossDomain:true,
            method : "POST",
            url: baseUrl+'getnotifiedpersondata',
            "headers": {
                "authorization": token,
                /* "Content-Type": "application/x-www-form-urlencoded",  */
                "cache-control": "no-cache",
            },
            contentType :"application/JSON",
            dataType : "json",
            data: JSON.stringify(notifiedperson),
            success:function(res){
               for(var i = 0;i<res.length;i++){
                   var username = res[i].name;
                   var userimage = res[i].img;
                   var userid = res[i]._id;

                   localStorage.setItem("friendname",username);
                   localStorage.setItem("friendid",userid);
                   localStorage.setItem("friendimage",baseUrl+userimage);
                  
                   window.location = baseUrl+"personalchatpage" ;
               }
            },
            error : function(jqXHR, textStatus, err){
                console.log('Ajax repsponse:',err);
              
            } 
        })
    })

    console.log("NOtification token"+token);
    /*notification count api */
    $.ajax({
        async: true,
        crossDomain: true,   
        method : "POST",
        url : baseUrl+"getNotificationCount",
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
          },
        contentType : "application/JSON"
    }).done(function(res){
        console.log("Number of Requests : " +res.length);
       /*  notificationCount = res.length; */
        $("#notificationcount").html(res.length);
    }).fail(function(e, s, t){
        console.log('Ajax repsponse:'+e);
    });


    
/*on accept api */
    $(document).on('click','.righttick',function(){
        var i= $(this).parent().find('span').html();
        console.log(i);
       
        $(this).parent().remove();
        console.log(i); 
        
        var requesteduser={
            object:i
        }
    $.ajax({
        async: true,
        crossDomain: true,
        type:'POST', 
        url:baseUrl+'useraction',
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
          },
        contentType: 'application/JSON',
       
        data:JSON.stringify(requesteduser),

        success: function(res){
            console.log(res);
        },
        error : function(jqXHR, textStatus, err){
            console.log('Ajax repsponse:',err);
           
        } 
      });    
   });

   /*on reject api */
   $(document).on('click','.wrongtick',function(){
    var i= $(this).parent().find('span').html();
    $(this).parent().remove();
    console.log(i); 
    var deleteduser={
        deleted:i
    }
    
    $.ajax({
        async: true,
        crossDomain: true,
        type:"POST",
        url:baseUrl+'userrejectaction',
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
          },
        contentType:'application/JSON',
        data:JSON.stringify(deleteduser),
        success: function(res){
            console.log(res);
        },
        error : function(jqXHR, textStatus, err){
            console.log('Ajax repsponse:',err);
            
        } 
    });
   });

   $('#btnsignout').on('click',function(){
    localStorage.clear();
  })
});