
$(function() {
   console.log("name of the user is" +name);
    console.log("loginperson of the app is" +loginperson);
    $(".usernameInput").val(loginperson);
   var $loginPage = $('.login.page'); // The login page
  var $chatPage = $('.chat.page'); // The chatroom page
   var username = $('.usernameInput').val();
   var feedback = $('#feedback');
  console.log("username is" +username);
    var socket = io();
    
   socket.on('message', addMessages);
       $(() => {

$('.message').keyup(function(event){
   if (event.keyCode === 13) {
     
    $("#send").click();
    $('.message').val('');
   }
});

$('.usernameInput').keyup(function(event){
   if (event.keyCode === 13) {
     
      $("#namesend").click();
     }
})
$('#namesend').click(()=>{
         
   console.log("username is" +username);

     $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click'); 
     
  }
);
        $("#send").click(()=>{

       sendMessage({
           name: $(".usernameInput").val(),  
          message:$(".message").val()});
          $('.message').val('');
        })

      getMessages()
    })
function addMessages(message){
   $(".messages").append(`
      <span style="color:blue;">  ${message.name} </span> :  ${message.message} <br>`)
   }
function getMessages(){
  $.get('http://localhost:3000/messages', (data) => {
   data.forEach(addMessages);
   })
 }
function sendMessage(message){
   $.post('http://localhost:3000/messages', message)
 }
  });