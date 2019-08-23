$(function(){
 
    // $('#setup-new-broadcast').one('click',function(){
    //     var hash = location.hash.substr(1);
    //     console.log("hash value"+hash);
    //     var token = localStorage.getItem("token");
    //     var friendsarray = [];
    //  function getfriendlist(){
    //     return new Promise((resolve,reject)=>{
    
    //         $.ajax({
    //             type:'GET',
    //             async: true,
    //             crossDomain:true,
    //             url:baseUrl+'userfriendslist',
    //             "headers": {
    //               "authorization": token,
    //               /* "Content-Type": "application/x-www-form-urlencoded",  */
    //               "cache-control": "no-cache",
    //             },
    //             contentType:"application/JSON",
    //             dataType:'json',
    //             success : function(res){ 
                 
    //               for (var i = 0; i < res.length; i++) {
    //                     console.log("Friend name: " + res[i][0].name);
    //                     var name = res[i][0].name;
    //                     friendsarray.push(name);
    //                     console.log("friends array is "+JSON.stringify(friendsarray));
    //                  }
    //                  resolve({result:'success'});
    //             },
    //             error: function (jqXHR, textStatus, err) {
    //               console.log('Ajax repsponse:', textStatus);
    //              }
    //           }); 
    //     })
    // }
    // return getfriendlist().then(Response =>{
    //     var loginpersonid = localStorage.getItem("loginpersonid");
    //     var loginpersonname = localStorage.getItem("loginpersonname");
    //     console.log("new arrray is "+JSON.stringify(friendsarray));
       
    //    socket.emit('sendlivestreamnotification',{loginpersonid:loginpersonid,friends:friendsarray,loginpersonname:loginpersonname,roomid:hash}); 
       
    //     });
    // })
   
})