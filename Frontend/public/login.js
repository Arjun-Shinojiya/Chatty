/* import { get } from "http"; */

$(function(){
    var username = $('#username').val();
    var password = $('#password').val();
    
    $('#btn_login').click(()=>{
       
       /*  var formData = new FormData($('.login-form')[0]);  */
       if(username == "" || password == ""){
       var userdata={
           username:$('#username').val(),
           password:$('#password').val()
       }
        $.ajax({
            type:'POST',
            url: baseUrl+'loginvalidation',
            contentType: 'application/JSON',
            data: JSON.stringify(userdata), 
            success : function(data){
                console.log('Get Response:',data);
              var personname = data.data.name;
              var personimage = data.data.img;
              var personid = data.data._id;
              localStorage.setItem("loginpersonid",personid);
              localStorage.setItem("loginpersonname",personname);
              localStorage.setItem("loginpersonimage",baseUrl+personimage);
              localStorage.setItem("token",data.token);
              window.location.href= baseUrl+"user"; 
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
                    'Login Response',
                    'Something went wrong while Login!',
                    {
                      status:'danger',
                      dismissable :true,
                      duration:5000,
                    }
                  );
             } 
        });
    }
    });

   

});


function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + JSON.stringify(profile));
    console.log('Name: ' + profile.ofa);
    
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var googleuserdata ={
        googleid:profile.getId(),
        googleimage:profile.getImageUrl(),
        googlename:profile.ofa,
        googleemail:profile.getEmail()
     }
     googleUser.disconnect();


    $.ajax({
        type:'POST',
        url: 'http://localhost:3000/signingoogle',
        contentType: 'application/JSON',
        
        data:JSON.stringify(googleuserdata),

        success(result){
            console.log("resultssss"+JSON.stringify(result));
            if((result.data[0] != undefined)){
                console.log(result.data[0].name);
                localStorage.setItem('loginpersonname',result.data[0].name);
                localStorage.setItem('loginpersonid',result.data[0]._id);
                localStorage.setItem('loginpersonimage',result.data[0].img);
                localStorage.setItem('token',result.token);
                 console.log(result);
                  window.location = 'http://localhost:3000/user';  
            }
            else{
                localStorage.setItem('loginpersonname',result.data.name);
                localStorage.setItem('loginpersonid',result.data._id);
                localStorage.setItem('loginpersonimage',result.data.img);
                localStorage.setItem('token',result.token);
                 console.log(result);
                window.location = 'http://localhost:3000/user';  
            }
        
           
         
        } , error : function(jqXHR, textStatus, err){
            console.log('Ajax repsponse:',textStatus);
           
        } 

    }) 

  }

