$(document).ready(function(){
   
    var token = localStorage.getItem('token');
   
    $.ajax({
    type: 'POST',
    async: true,
    crossDomain: true,
    url: baseUrl+'updateuseronlinestatustooffline',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: "application/JSON",
    dataType: 'json',
    
    success: function (res) {
      console.log("update status to offline" + res);
     
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:'+err);

    }
  });
});
