$( function() {
    $( "#birthdate" ).datepicker({
        dateFormat: 'dd-mm-yy',
        changeMonth: true,
        changeYear: true,
        maxDate: 'now'

    });
});

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
  });
  var imgdata1;
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
          })
        })
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
   
  $("#fileupload").change(function() {
    readURL(this);
  });

if($('#myform').length > 0){
$('#myform').validate({
    rules:{
        name:{
            required:true,
            minlength:3
        },
        lastname:{
            required:true,
            minlength:3
        },
         phone:{
            required:true,
            minlength:12
         },
         zipcode:{
             required:true,
             minlength:6
         },
         birthdate:{
             required:true,
         },

         username:{
             required:true,
             minlength:3
         },
         datepicker:{
             required:true
         }
    }
   
});}
$("input#name").on({
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
	document.getElementById('error').innerHTML = '';
	document.getElementById('name').style.borderColor = "";
	var firstname = document.getElementById('name').value;
    var temp = 0;
    
    for(i=0;i<firstname.length;i++)
        {
            t = firstname.charCodeAt(i);
            if((t >= 48 && t<=57) || (t >= 33 && t <= 47) || (t >= 58 && t <= 64) 
                    || (t >= 91 && t <= 96) || (t >= 123 && t <= 126) || (t == 32) ){
                temp = 1;
        }
			if(temp == 1){
               
                document.getElementById('error').style.color = "red"; 
                document.getElementById('error').innerHTML = "Enter letters only!!";
                document.getElementById('name').style.borderColor = "red";
            }
        }
     return !error;
} 
function validatelastname(){
	document.getElementById('lastnameerror').innerHTML = '';
	document.getElementById('lastname').style.borderColor = "";

	var lastnameerror = false;
	var temp = 0;
	
	var lastname = document.getElementById('lastname').value;

	 
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
                document.getElementById('lastname').style.borderColor = "red";
            }
        }
     
	return !lastnameerror;
}
function validateemail(){
	
	 document.getElementById('emailerror').innerHTML = '';
	document.getElementById('email').style.borderColor = "";
     
     var emailExp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
	 var email = document.getElementById('email').value;
    
    	if(!(email.match(emailExp))){
    		  document.getElementById('emailerror').style.color = "red"; 
            document.getElementById('emailerror').innerHTML = "Please enter valid email address";
            document.getElementById('email').style.borderColor = "red";
    	}
  }

 
function validatepassword(){ 
	
	 var passworderror = false;
	  var t='';
	 var count_capital =0, count_digit=0, count_small=0, count_special=0;
	 var pass = document.getElementById('pass').value;

	  if(pass != '' || pass.length > 8 || pass.length < 12){
       
       document.getElementById('passworderror').innerHTML = '';
		document.getElementById('pass').style.borderColor = "";
    }

     for(x=0;x<pass.length;x++)
    {
        t = pass.charCodeAt(x);
           if(t >= 65 && t <= 90)
        {
            count_capital = 1;
        }

        if (t >= 48 && t <= 57) 
        {
            count_digit = 1;
        }

        if((t >= 33 && t <= 47) || (t >= 58 && t <= 64) || (t >= 91 && t <= 96) || (t >= 123 && t <= 126)){
            count_special = 1;
        }

        if(t >= 97 && t <=122){
            count_small = 1;
        }    
    }

    if (count_digit == 1 && count_capital == 1 && count_small == 1 && count_special == 1) 
    {
        document.getElementById('passworderror').innerHTML = "";
      	document.getElementById('pass').style.borderColor = "";
    }

    else
    {
        document.getElementById('passworderror').style.color = "red"; 
        document.getElementById('passworderror').innerHTML = "Password Invalid !!";
        document.getElementById('pass').style.borderColor = "red";
    }        
}

function validatephonenumber(){
 document.getElementById('phonenumbererror').innerHTML = '';
	document.getElementById('phonenumber').style.borderColor = "";
	var phoneno = /^\+[1-9]{2}\s[0-9]{10}$/;
	var phonenumber = document.getElementById('phonenumber').value;

	if(!(phonenumber.match(phoneno)))
     
      {
       document.getElementById('phonenumbererror').style.color = "red"; 
        document.getElementById('phonenumbererror').innerHTML = "please write +91 before inputnumber";
        document.getElementById('phonenumber').style.borderColor = "red";
      }
}



        function get(){
            var name = $('#name').val();
            var lastname = $('#lastname').val();
            var email = $('#email').val();
            var pass= $('#pass').val();
            var phonenumber = $('#phonenumber').val();
            var zipcode = $('#zipcode').val();
            var birthdate = $('#birthdate').val();
            var elem = document.getElementById('result');
            var functionerror = $('.validation1').text();
            var error = $('.error').text();
            var username = $('#username').val();
           
            var img = $('#fileupload').val();
           var imgdata = imgdata1;

        
           
            if(!(name == "" )&& !(lastname == "") && !(email=="") && !(pass=="") && !(phonenumber=="") && !(elem.getAttribute('src') == "")
            && !(zipcode=="") && !(birthdate=="") && (functionerror =="") && (error =="")  && !(username =="")){
                        
                
                  var formData = new FormData($('#myform')[0]); 
                  console.log(JSON.stringify(formData));
                   
           $.ajax({
                type: 'POST',
                url: baseUrl+'save',
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": formData, 
                "processData": false,
               
                
                 beforeSend: function() {
                    $("#myform").css('display','none');
                    $(".loader").css('display','flex');
                    $(".bor").css('display','block');
                    $(".loader").fadeIn(500);
                    $(".bor").fadeIn(500);
                 } ,  
                 success : function(data){
                    
                     if(data == 'fail'){
                         alert("Email id is already been registered");
                         window.location.href=baseUrl+"registration";   
                     } else{
                        console.log('Get Response:',data);
                        console.log("image is" +img);
                        var mkConfig = {
                            positionY: 'bottom',
                            positionX: 'right',
                            max: 5,
                            scrollable: true
                          };
                  
                          mkNotifications(mkConfig);
                  
                          mkNoti(
                            'Registration Response',
                            'You registered Successfully!',
                            {
                              status: 'success',
                              dismissable: true,
                              duration: 5000,
                            }
                          );
                         window.location.href=baseUrl;    
                       }
                },
               error : function(jqXHR, textStatus, err){
                   console.log('Ajax repsponse:',textStatus);
                   alert("nayy")
               } 
        }); 
    }
        else
        {
            alert("PLease fill the form")
        } 
    }

       
      
      