$(function(){
   
var loginpersonid=localStorage.getItem("loginpersonid");
var token = localStorage.getItem("token");
var loginperson = {loginpersonid:loginpersonid};
var imagedata=localStorage.getItem("loginpersonimage");

/*get login person details api */
$.ajax({
    async: true,
    crossDomain: true,
    type: 'POST',
    url: baseUrl+'getuserprofiledetails',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: 'application/JSON',
    dataType: 'json',
    data:JSON.stringify(loginperson),
    success: function (res) {
        $("#totalfriends").html(res.friends.length);
       $('#inputName').val(res.username);
       $('#inputEmail').val(res.email);
       $('#inputLastname').val(res.lastname);
       $('#inputPhonenumber').val(res.phonenumber);
       $('#inputBirthdate').val(res.birthdate);
       $(".profile-username").html(res.username);
       $('.profile-user-img img-responsive img-circle').attr('src',imagedata);
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
      
    }
  });
});

/*validations */
 $(document).ready(function(){
    $( "#inputBirthdate" ).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: 'now'
    });
});

$("input#inputName").on({
    keydown: function(e) {
      if (e.which === 32)
        return false;
    },
    change: function() {
      this.value = this.value.replace(/\s/g, "");
    }
  });

 function validatefirstname(){
    var error = false;
    document.getElementById('nameerror').innerHTML = '';
    document.getElementById('inputName').style.borderColor = "";
    var firstname = document.getElementById('inputName').value;
    var temp = 0;

    if(firstname.length <3){
        document.getElementById('nameerror').style.color = "red"; 
        document.getElementById('nameerror').innerHTML = "Enter Valid name";
        document.getElementById('inputName').style.borderColor = "red";
    }
    
    for(i=0;i<firstname.length;i++)
        {
            t = firstname.charCodeAt(i);
            if((t >= 48 && t<=57) || (t >= 33 && t <= 47) || (t >= 58 && t <= 64) 
                    || (t >= 91 && t <= 96) || (t >= 123 && t <= 126) || (t == 32) ){
                temp = 1;
        }
            if(temp == 1){
               
                document.getElementById('nameerror').style.color = "red"; 
                document.getElementById('nameerror').innerHTML = "Enter letters only!!";
                document.getElementById('inputName').style.borderColor = "red";
            }
        }
     return !error;
} 

function validatelastname(){
    var error = false;
    document.getElementById('lastnameerror').innerHTML = '';
    document.getElementById('inputLastname').style.borderColor = "";
    var lastname = document.getElementById('inputLastname').value;
    var temp = 0;

    if(lastname.length <3){
        document.getElementById('lastnameerror').style.color = "red"; 
        document.getElementById('lastnameerror').innerHTML = "Enter Valid name";
        document.getElementById('inputLastname').style.borderColor = "red";
    }
    
    for(i=0;i<lastname.length;i++)
        {
            t = lastname.charCodeAt(i);
            if((t >= 48 && t<=57) || (t >= 33 && t <= 47) || (t >= 58 && t <= 64) 
                    || (t >= 91 && t <= 96) || (t >= 123 && t <= 126) || (t == 32) ){
                temp = 1;
        }
            if(temp == 1){
               
                document.getElementById('lastnameerror').style.color = "red"; 
                document.getElementById('lastnameerror').innerHTML = "Enter letters only!!";
                document.getElementById('inputLastname').style.borderColor = "red";
            }
        }
     return !error;
}

function validateemail(){
	
    document.getElementById('emailerror').innerHTML = '';
   document.getElementById('inputEmail').style.borderColor = "";
    
    var emailExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var email = document.getElementById('inputEmail').value;
   
       if(!(email.match(emailExp))){
             document.getElementById('emailerror').style.color = "red"; 
           document.getElementById('emailerror').innerHTML = "Please enter valid email address";
           document.getElementById('inputEmail').style.borderColor = "red";
       }
 }

 function validatephonenumber(){
    document.getElementById('phonenumbererror').innerHTML = '';
       document.getElementById('inputPhonenumber').style.borderColor = "";
       var phoneno = /^\+[1-9]{2}\s[0-9]{10}$/;
       var phonenumber = document.getElementById('inputPhonenumber').value;
   
       if(!(phonenumber.match(phoneno)))
        
         {
          document.getElementById('phonenumbererror').style.color = "red"; 
           document.getElementById('phonenumbererror').innerHTML = "please write +91 before inputnumber";
           document.getElementById('inputPhonenumber').style.borderColor = "red";
         }
   }

function validatebirthdate(){
    document.getElementById('birthdateerror').innerHTML = '';
    document.getElementById('inputBirthdate').style.borderColor = "";
  
    var birthdate = document.getElementById('inputBirthdate').value;

    if(birthdate.length < 2)
     
      {
       document.getElementById('birthdateerror').style.color = "red"; 
        document.getElementById('birthdateerror').innerHTML = "please insert birthdate";
        document.getElementById('inputPhonenumber').style.borderColor = "red";
      }
}

/* var imgdata1;
function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#my-image').attr('src', e.target.result);
      var resize = new Croppie($('#my-image')[0], {
        viewport: { width: 100, height: 100 },
        boundary: { width: 300, height: 300 },
        showZoomer: true,
        enableResize: true,
        enableOrientation: true,
      
      });
      $('#use').fadeIn();
     
      $('#use').on('click', function(e) {
          e.preventDefault();
        resize.result('base64').then(function(dataImg) {
         
          imgdata1 = [{ image: dataImg }, { name: 'myimgage.jpg' }];
          // use ajax to send data to php
          $('#result').attr('src', dataImg);
         $("#imagecrop").val(dataImg);
         console.log("imagecrop val"+ $("#imagecrop").val());
        })
      })
    }
    reader.readAsDataURL(input.files[0]);
  }
}
 
$("#fileupload").change(function() {
  readURL(this);
});
 */

 /* Onclick update button api */
 function get(){
    document.getElementById("loader").style.display = "block";
    var token = localStorage.getItem("token");
    var filepath = $("#fileupload").val();
    var name =$('#inputName').val();
    var lastname = $('#inputLastname').val();
  
      var filename = filepath.replace(/^.*(\\|\/|\:)/, '');
      if(filename != ''){
       localStorage.setItem('loginpersonimage', baseUrl+filename);
      }
      var formData = {
        name : $('#inputName').val(),
        lastname :  $('#inputLastname').val(),
        phonenumber :$('#inputPhonenumber').val(),
        email : $('#inputEmail').val(),
        filename : filename,
        birthdate:$('#inputBirthdate').val(),
        img : $('#imagecrop1').val()
      };
    
 
    $.ajax({
        type: 'POST',
        url: baseUrl+'updateprofile',
        contentType:'application/JSON',
        dataType:'json',
        data: JSON.stringify(formData), 
     
        "headers": {
            "authorization": token,
            /* "Content-Type": "application/x-www-form-urlencoded",  */
            "cache-control": "no-cache",
          },
         success : function(data){
            document.getElementById("loader").style.display = "none";
          
            var imagedata=localStorage.getItem("loginpersonimage");
            $('.user-image').attr('src',imagedata);
            $('.profile-user-img img-responsive img-circle').attr('src',imagedata);
            $('.img-circle').attr('src',imagedata);
         
            $(".profile-username").html(name);
            var mkConfig = {
              positionY: 'bottom',
              positionX: 'right',
              max: 5,
              scrollable: true
            };
          
            mkNotifications(mkConfig);
          
            mkNoti(
              'Update Response',
              'Profile Updated Successfully!',
              {
                status:'success',
                dismissable :true,
                duration:5000,
              }
            );

            },
       error : function(jqXHR, textStatus, err){
           console.log('Ajax repsponse:',err);
           var mkConfig = {
            positionY: 'bottom',
            positionX: 'right',
            max: 5,
            scrollable: true
          };
        
          mkNotifications(mkConfig);
        
          mkNoti(
            'Update Response',
            'Something went wrong while updating!',
            {
              status:'danger',
              dismissable :true,
              duration:5000,
            }
          );
       } 
    }); 
}






