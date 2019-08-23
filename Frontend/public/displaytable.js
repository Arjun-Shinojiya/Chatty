// $(window).load(function(){
           
//     $.ajax({
//         type: 'GET',
//         url: 'http://localhost:8080/gettable',
//         dataType: 'json',
//         contentType:'application/JSON'
//        }) 
//        .done(function(res){
//           console.log('Get Response:',res);
//           var table = $('#example').DataTable();
//           $.fn.dataTable.ext.errMode = 'none';
//           $.each(res.docs, function(index, user){
           
//             $.each(user, function(index2, sub_user){
             
//                /*  $("#example").append($('<tr>')
//                 .append($('<td>').append(sub_user.name))
//                 .append($('<td>').append(sub_user.lastname))
//                 .append($('<td>').append(sub_user.email))
//                 .append($('<td>').append(sub_user.pass))
//                 .append($('<td>').append(sub_user.birthdate))
//                 .append($('<td>').append(sub_user.zipcode))
//                 .append($('<td>').append(sub_user.phonenumber))
//              ); */
//              var thisRow = [];
//             thisRow.push(sub_user.name);
//             thisRow.push(sub_user.lastname);
//             thisRow.push(sub_user.email);
//             thisRow.push(sub_user.pass);
//             thisRow.push(sub_user.birthdate);
//             thisRow.push(sub_user.zipcode);
//             thisRow.push(sub_user.phonenumber);
// 	        table.row.add(thisRow).draw();
//              }); 
           
           
//           });
          
          
//        })
//        .fail(function(jqXHR, textStatus, err){
//            console.log('Ajax repsponse:',textStatus);
//            alert("nayy")
//        }); 
// } );

$(document).ready(function(){
   var selected=[];
   $('#example').DataTable({
      "processing": true,
       "serverSide": true, 
      "search" :true,
     
      "ajax": "http://localhost:8080/gettable"
      
      
   });
  
});