$(function () {
 var token = localStorage.getItem("token");
 

 /* get users list api */
 $.ajax({
    async: true,
    crossDomain: true,
    type: 'GET',
    url: baseUrl+'userdata',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: 'application/JSON',
    dataType: 'json',

    success: function (res) {
      document.getElementById("loader").style.display = "none";
    $(".tab-2").css({"display":"block"});
      var name = localStorage.getItem("loginpersonname");
      var image = localStorage.getItem("loginpersonimage");
      console.log(name);
      $('.username').html(name);
      $('.hidden-xs').html(name);
      $('.insideprofilename').html(name);
      $('.user-image').attr('src',image);
      $('.img-circle').attr('src',image);
     
      for (var i = 0; i < res.length; i++) {
       if(res[i].googleid == ""){
        var list = $('#alluser');
        list.append('<li class="username"><img id="userimage" src="'+baseUrl+res[i].img+'"><h6 class="name" id="name">'+ res[i].name + '</h6><input type="hidden" value='+res[i]._id+' class="userid"><button class="requeststatus" id="sendrequestbutton">Send Request</button></li>')    
       }else{
        var list = $('#alluser');
        list.append('<li class="username"><img id="userimage" src="'+res[i].img+'"><h6 class="name" id="name">'+ res[i].name + '</h6><input type="hidden" value='+res[i]._id+' class="userid"><button class="requeststatus" id="sendrequestbutton">Send Request</button></li>')    
       }
         
       }
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
      var mkConfig = {
        positionY: 'bottom',
        positionX: 'right',
        max: 5,
        scrollable: true
      };
    
      mkNotifications(mkConfig);
    
      mkNoti(
        'UserPage Response',
        'Something went wrong!',
        {
          status:'danger',
          dismissable :true,
          duration:5000,
        }
      );
    }
  });


/*get notification count api */
  $.ajax({
    async: true,
    crossDomain: true,
    method: "POST",
    url: baseUrl+'getNotificationCount',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: "application/JSON"
  }).done(function (res) {
    console.log("Number of Requests : " + res.totalcount);
    /*  notificationCount = res.length; */
    $("#notificationcount").html(res.totalcount);
  }).fail(function (e, s, t) {
   console.log("error msg"+e);
  });

  
/*get friendlist api */
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
            console.log("Item name: " + res[i][0].name);
            if(res[i][0].googleid == ""){
              var friendlist=$('#friendslist');
              friendlist.append('<li class="friendname" style="cursor:pointer"><img id="userimage" src="'+baseUrl+res[i][0].img+'"><h6>'+res[i][0].name+'</h6></li>');
            }else{
            var friendlist=$('#friendslist');
            friendlist.append('<li class="friendname" style="cursor:pointer"><img id="userimage" src="'+res[i][0].img+'"><h6>'+res[i][0].name+'</h6></li>');
            }
            
      }
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
     
    }
  }); 

  /*status api*/

  $.ajax({
    type: 'GET',
    async: true,
    crossDomain:true,
    url: baseUrl+'showstatus',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: 'application/JSON',
      success: function (res) {
      for (i = 0; i < res.length; i++) {
          $("li input").each(function (index) {
        
          if ($(this).val() == res[i].touser) {
          
          
            if (res[i].request_sent == true && res[i].reject_status == true) {
              $(this).next().css("display", "block");

            }
           
            if (res[i].request_sent == true && res[i].reject_status == false) {
              $(this).next().prop("disabled", "disabled");
              $(this).next().css({"cursor": "not-allowed","opacity":".65"})
            }
          }
        });
      }
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
     
    }
  });

  /*Show user groups api */
  $.ajax({
    type:'GET',
    async:true,
    crossDomain:true,
    url: baseUrl+'showusergroups',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: 'application/JSON',
    success:function(res){
      
      for(var i =0;i<res.length;i++){
        console.log(res[i].groupname);
       var groups =  $('#grouplist');
       groups.append('<li class="usergroups" style="cursor:pointer" ><img id="groupimage" src="public/assets/grouplogo.png"><h6 class="groupname" style="float:left;">'+res[i].groupname+'</h6><span class="label label-warning" id="groupmessagecount" style="float:right;margin-top: 20px;font-size: 15px;margin-right: 20px;">0</span></li>')
      }
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
     }
  });

  /* groups notification count api */
  var token = localStorage.getItem('token');
  $.ajax({
    type:'GET',
    async:true,
    crossDomain:true,
    url:baseUrl+'getgroupnotifcationcount',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType:'application/JSON',
    success:function(res){
      console.log("array response"+JSON.stringify(res));
       var  array_elements = res;
      array_elements.sort();
      var current = null;
      var cnt = 0;
      var array =[];
      for (var i = 0; i < array_elements.length; i++) {
          if (array_elements[i] != current) {
              if (cnt > 0) {
                  console.log("first loop");
                  console.log(current + ' comes --> ' + cnt + ' times');
                  array.push([current,cnt]);
              }
              current = array_elements[i];
              cnt = 1;
          } else {
            console.log("second loop");
              cnt++;
          }
      }
      if (cnt > 0) {
          console.log(current + ' comes --> ' + cnt + ' times');
          array.push([current,cnt]);
      }
    console.log("new array is"+JSON.stringify(array));
    
      for(var i =0;i<array.length;i++){
        $("li .groupname").each(function(index){
          console.log("group name "+$(this).html());
          var liname = $(this).html();
         if(liname == array[i][0]){
         var t = $(this).next().html();
         t=array[i][1];
         console.log("t value"+t);
         $(this).next().html(""+t);
         }
          else{
            console.log("nothing to show");
          }
        });
      }
     }, error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
     }
  })

 /*onsignout button api */
  $('#btnsignout').on('click',function(){
    $.ajax({
      type:'GET',
      contentType:'application/JSON',
      url:baseUrl+'logout',
      success(res){
        localStorage.clear();
        window.location = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue="+baseUrl
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
       
      }
    })
  }) 
 
/*requestnotification page api*/
 $('#request_notification').one("click", function () {
   /*  e.preventDefault(); */
  
    $.ajax({
      async: true,
      crossDomain:true,
      type: 'POST',
      url: baseUrl+'requestuserdata',
      "headers": {
        "authorization": token,
        /* "Content-Type": "application/x-www-form-urlencoded",  */
        "cache-control": "no-cache",
      },
      contentType: 'application/JSON',


      success: function (res) {
        
        res.send(window.location = baseUrl+'chatrequestpage');
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
      
      }
    });
  });

 
/*friendlist click api */
  $('#friendslist').on("click","li.friendname",function (e){
    var friendname;
    var friendimage;
    var myObject, newfolder;
    var ActiveXObject;
    var element =$(this).find('h6');
    var image = $(this).find('img');
    friendimage = image.attr('src');
    friendname = element.html();
    var loginpersonname = localStorage.getItem('loginpersonname');
    localStorage.setItem("friendname",friendname);
    localStorage.setItem("friendimage",friendimage);
    var friend = {
      friendname : friendname
    }
   
   
    $.ajax({
      async: true,
      crossDomain:true,
      type: 'POST',
      url: baseUrl+'getfriendsdata',
      "headers": {
        "authorization": token,
        /* "Content-Type": "application/x-www-form-urlencoded",  */
        "cache-control": "no-cache",
      },
      contentType: 'application/JSON',
    
      data:JSON.stringify(friend),
      success: function (res) {
       
        for(var i = 0;i<res.length;i++){
          console.log("friend id" +res[i]._id);
          var friendid = res[i]._id;
          localStorage.setItem("friendid",friendid);
        }
         window.location = baseUrl+'personalchatpage' ;
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
      
      }
    });
  });
});

/*accidentaly when user close tab api */
window.onbeforeunload = function(){
$.ajax({
        type:'GET',
        contentType: 'application/JSON',
        url: baseUrl+'ontabclose',

        success:function(res){
          console.log(res);
        },
        error: function (jqXHR, textStatus, err) {
          console.log('Ajax repsponse:', textStatus);
         
        }
});
}

$(document).ready(function(){
 
  /*search in list code */
  $(".searchTerm").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#alluser li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#searchid").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#friendslist li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#searchid1").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#grouplist li").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  /*group list click api */
  $('#grouplist').on('click','li.usergroups',function(){
    var element =$(this).find('h6');
    var groupname = element.html();
    var token = localStorage.getItem("token");
    var group = {groupname:groupname};
    $.ajax({
      type:'POST',
      async: true,
      crossDomain:true,
      url:baseUrl+'opengroupchatpage',
      "headers": {
        "authorization": token,
        /* "Content-Type": "application/x-www-form-urlencoded",  */
        "cache-control": "no-cache",
      },
      contentType:"application/JSON",
      dataType:'json',
      data:JSON.stringify(group),
      success : function(res){ 
        var array =[];
       for(var i = 0;i<res[0].groupmembers.length;i++){
         console.log("response"+JSON.stringify(res));
        array.push(res[0].groupmembers[i].name)
        }
        console.log(array);
       localStorage.setItem("groupmembers",array);
       localStorage.setItem("groupname",res[0].groupname);
      localStorage.setItem("groupid",res[0]._id);
      localStorage.setItem("groupadmin",res[0].admin);
      window.location =baseUrl+'groupchathtml' ; 
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
        
      }
  });

});



/*pop api */
$('.requestgroup').one('click',function(){
  var token = localStorage.getItem("token");
 

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
      console.log("friends res"+res);
       for (var i = 0; i < res.length; i++) {
            console.log("Item name: " + res[i][0].name);
            var friendlist=$('.friendsgrouplist');
           /*  friendlist.append('<li class="friendname"><img id="userimage" src="'+res[i][0].img+'"><h6>'+res[i][0].name+'</h6></li>'); */
            friendlist.append('<li style="list-style: none; "><img src="'+res[i][0].img+'"  class="groupuserimage"><p class="groupusername"  id="groupusername">'+res[i][0].name+'</p><label class="label1" style="float:right;"><input  class="label__checkbox" type="checkbox" value ='+res[i][0].name+' /><span class="label__text"><span class="label__check"><i class="fa fa-check icon"></i></span></span></label></li>');
      } 
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
      
    }
  }); 
});


/*save group api */
$('#save-group').on('click',function(){
  $('.groupcreateerror').html("");
  var loginpersonname = localStorage.getItem("loginpersonname");
 var groupname = $('#groupname').val();
 console.log("groupname value"+groupname);
 var allVals = [];
          $('input:checkbox[type=checkbox]:checked').each(function () {
            allVals.push($(this).val());
          
          });
         
         
          console.log("allvals"+allVals);
  if(allVals.length <=1){
    $('.groupcreateerror').text("Group length should be more than 2");
  } else{
    localStorage.setItem('groupname',groupname);

    var token = localStorage.getItem("token");
    var loginpersonid = localStorage.getItem("loginpersonid");
    allVals.push(loginpersonname);
    var groupdata = {groupname: $('#groupname').val(),
                    groupmember:allVals,
                    loginpersonid:loginpersonid}
    $.ajax({
      type:'POST',
      async:'true',
      crossDomain:'true',
      url:baseUrl+'usergroupdata',
      "headers": {
        "authorization": token,
        "cache-control": "no-cache",
      },
      contentType:'application/JSON',
      data:JSON.stringify(groupdata),
      success(res){
        console.log(res);
        if(res.fail){
          $('.groupcreateerror').text("Group name is already taken");
        }else{
          $('.groupcreateerror').text("Group Successfully Created").css({'color':'green'});
          var mkConfig = {
            positionY: 'bottom',
            positionX: 'right',
            max: 5,
            scrollable: true
          };
        
          mkNotifications(mkConfig);
        
          mkNoti(
            'Group Response',
            'Group Created Successfully!',
            {
              status:'success',
              dismissable :true,
              duration:5000,
            }
          );
        }
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', err);
      
      }
    });
  }
});


/*related css changes */
$('.letschaticon').on('click',function(){
 
  $('.allusers').css({"display":"none"});
  $('.tabs').fadeIn("slow");
  $('.tabs').css({"display":"block"});
  $('.classname').html("Friends");
});

$('.opendashboard').on('click',function(){
  $('.tabs').css({"display":"none"});
  $('.allusers').fadeIn("slow");
  $('.allusers').css({"display":"block"});
  $('.classname').html("All Users");

})

$('#tab-2').on('click',function(){
  $('.classname').html("Groups");
})

$('#tab-1').on('click',function(){
  $('.classname').html("Friends");
})

});


