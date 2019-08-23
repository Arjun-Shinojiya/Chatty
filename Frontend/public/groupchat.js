$(function () {
  var groupmembers = localStorage.getItem("groupmembers");
  var createdby = localStorage.getItem("createdby");
  var groupname = localStorage.getItem("groupname");
  $('.box-title').html(" " + groupname);
  var groupid = localStorage.getItem("groupid");
  var loginpersonname = localStorage.getItem("loginpersonname");
  var token = localStorage.getItem("token");
  var groupid = { groupid: groupid };

  /*show group messages api */
  $.ajax({
    type: 'POST',
    async: true,
    crossDomain: true,
    url: baseUrl+'groupchatconvo',
    "headers": {
      "authorization": token,
      /* "Content-Type": "application/x-www-form-urlencoded",  */
      "cache-control": "no-cache",
    },
    contentType: "application/JSON",
    dataType: 'json',
    data: JSON.stringify(groupid),
    success: function (res) {
      console.log("group message " + res);
      for (var i = 0; i < res.length; i++) {
        var date = res[i].date;
        var momentdate = moment(date).format("MMMM Do, h:mm:ss a");
        if (res[i].fromUser == loginpersonname) {
          var ownmessage = '<div class="direct-chat-msg right"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-right"></span><span class="direct-chat-timestamp pull-left">' + momentdate + '</span></div><div class="direct-chat-text" id="message">' + res[i].message + '</div></div>'
          $('.direct-chat-messages').append(ownmessage);
        } else {
          var friendusermessage = '<div class="direct-chat-msg"><div class="direct-chat-info clearfix"><span class="direct-chat-name pull-left">' + res[i].fromUser + '</span><span class="direct-chat-timestamp pull-right">' + momentdate + '</span></div><div class="direct-chat-text" id="message">' + res[i].message + '</div></div>'
          $('.direct-chat-messages').append(friendusermessage);
        }
      }
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);

    }
  });

});

$(document).ready(function () {

  /*add member in group api */
  $('.addmemberplus').one('click', function () {
    var splitArr = []
    var groupmembers = localStorage.getItem("groupmembers");
    splitArr = groupmembers.split(',');
    console.log("Splitted : " + splitArr.length);
    var token = localStorage.getItem("token");

    $.ajax({
      type: 'GET',
      async: true,
      crossDomain: true,
      url: baseUrl+'userfriendslist',
      "headers": {
        "authorization": token,

        "cache-control": "no-cache",
      },
      contentType: "application/JSON",
      dataType: 'json',

      success: function (res) {


        for (var i = 0; i < res.length; i++) {
          if ($.inArray(res[i][0].name, splitArr) == -1) {
            var friendlist = $('.groupsfriendlist');
            friendlist.append('<li style="list-style: none; "><img src="' + res[i][0].img + '"  class="groupuserimage"><p class="groupusername"  id="groupusername">' + res[i][0].name + '</p><label class="label1" style="float:right;"><input  class="label__checkbox" type="checkbox" value =' + res[i][0].name + ' /><span class="label__text"><span class="label__check"><i class="fa fa-check"></i></span></span></label></li>');
          } else {
            console.log("notjing to do");
          }

        }
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);

      }
    });

  });

  /*add member in group */
  $('#insert-member').on('click', function () {
    $('.groupcreateerror').html("");
    var loginpersonname = localStorage.getItem("loginpersonname");
    var groupid = localStorage.getItem("groupid");
    var token = localStorage.getItem("token");

    var allVals = [];
    var newVal = [];
    $('input:checkbox[type=checkbox]:checked').each(function () {
      allVals.push($(this).val());
      newVal.push($(this).val());
    });
    var groupmembrs = localStorage.getItem('groupmembers');
    allVals.push(groupmembrs);
    localStorage.setItem("groupmembers", allVals);
    var newmember = { newmember: newVal, groupid: groupid };



    $.ajax({
      type: 'POST',
      async: true,
      crossDomain: true,
      url: baseUrl+'addgroupmember',
      "headers": {
        "authorization": token,

        "cache-control": "no-cache",
      },
      contentType: "application/JSON",
      dataType: 'json',
      data: JSON.stringify(newmember),
      success: function (res) {
        console.log(res);
        var mkConfig = {
          positionY: 'bottom',
          positionX: 'right',
          max: 5,
          scrollable: true
        };

        mkNotifications(mkConfig);

        mkNoti(
          'Member Response',
          'Member added successfully in group!',
          {
            status: 'success',
            dismissable: true,
            duration: 5000,
          }
        );


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
          'Member Response',
          'Something went wrong while adding member!',
          {
            status: 'danger',
            dismissable: true,
            duration: 5000,
          }
        );

      }
    });
  });

  /*leave group api */
  $("#leavegroup").on("click", function () {
    var splitArr = []
    var groupmembers = localStorage.getItem("groupmembers");
    splitArr = groupmembers.split(',');
    var token = localStorage.getItem("token");
    var loginpersonname = localStorage.getItem("loginpersonname");
    var groupid = localStorage.getItem("groupid");

    Array.prototype.remove = function (elem) {
      var indexElement = this.findIndex(el => el === elem);
      if (indexElement != -1)
        this.splice(indexElement, 1);
      return this;
    };

    splitArr.remove(loginpersonname);
    console.log("dd", splitArr);

    localStorage.setItem("groupmembers", splitArr);
    var exitperson = { loginpersonname: loginpersonname, groupid: groupid }
    var members = { groupmembers: splitArr };
    $.ajax({
      type: 'POST',
      async: true,
      crossDomain: true,
      url: baseUrl+'leavegroup',
      "headers": {
        "authorization": token,

        "cache-control": "no-cache",
      },
      contentType: "application/JSON",
      dataType: 'json',
      data: JSON.stringify(exitperson),
      success: function (res) {

        if (res.fail == "cantleave") {

          var mkConfig = {
            positionY: 'bottom',
            positionX: 'right',
            max: 5,
            scrollable: true
          };

          mkNotifications(mkConfig);

          mkNoti(
            'Leave Response',
            'You need to make another admin first and then you can leave!',
            {
              status: 'default',
              dismissable: true,
              duration: 7000,
            }
          );

          /*if admin wanna leave then he need to make another admin first api */
          $.ajax({
            type: 'POST',
            async: true,
            crossDomain: true,
            url: baseUrl+'groupmemberslist',
            "headers": {
              "authorization": token,

              "cache-control": "no-cache",
            },
            contentType: "application/JSON",
            dataType: 'json',
            data: JSON.stringify(members),
            success: function (res) {
              console.log(res);
              $('#modal-makeadmin').modal('show');
              for (var i = 0; i < res.length; i++) {

                var adminlist = $('.makeadminlist');
                adminlist.append('<li style="list-style: none; "><img src="' + res[i].img + '"  class="memberimage"><p class="membername"  id="membername">' + res[i].name + '</p><label class="label1" style="float:right;"><input  class="label__checkbox" type="checkbox" value =' + res[i].name + ' /><span class="label__text"><span class="label__check"><i class="fa fa-check"></i></span></span></label></li>');
              }
              $('input.label__checkbox').on('change', function () {
                $('input.label__checkbox').not(this).prop('checked', false);
              });

            },
            error: function (jqXHR, textStatus, err) {
              console.log('Ajax repsponse:', textStatus);
            }
          });

        }
        else {
          console.log("leave");
          window.location = baseUrl+'user'
        }
      },
      error: function (jqXHR, textStatus, err) {
        console.log("error" + err);
      }

    });

  });

  /*make admin api */
  $("#makeadmin").one("click", function () {
    var groupid = localStorage.getItem("groupid");
    var adminval;
    var token = localStorage.getItem("token");
    $('input:checkbox[type=checkbox]:checked').each(function () {
      adminval = ($(this).val());
    });
    console.log("adminval" + adminval)
    if (adminval != null) {
      var adminname = { admin: adminval, groupid: groupid };
      $.ajax({
        type: 'POST',
        async: true,
        crossDomain: true,
        url: baseUrl+'changeadmin',
        "headers": {
          "authorization": token,

          "cache-control": "no-cache",
        },
        contentType: "application/JSON",
        dataType: 'json',
        data: JSON.stringify(adminname),
        success: function (res) {
          console.log(res);
          window.location = baseUrl+'user'
        },
        error: function (jqXHR, textStatus, err) {
          console.log('Ajax repsponse:', textStatus);
        }

      })
    } else {
      alert("Please select admin first");
    }
  });

  /*show group members api */
  $(".showmembers").one("click", function () {
    var splitArr = []
    var loginpersonname = localStorage.getItem("loginpersonname");
    var groupmembers = localStorage.getItem("groupmembers");
    var loginpersonid = localStorage.getItem("loginpersonid");
    var groupadmin = localStorage.getItem("groupadmin");
    splitArr = groupmembers.split(',');

    Array.prototype.remove = function (elem) {
      var indexElement = this.findIndex(el => el === elem);
      if (indexElement != -1)
        this.splice(indexElement, 1);
      return this;
    };

    splitArr.remove(loginpersonname);
    console.log("dd", splitArr);


    var token = localStorage.getItem("token");
    var members = { groupmembers: splitArr };
    $.ajax({
      type: 'POST',
      async: true,
      crossDomain: true,
      url: baseUrl+'groupmemberslist',
      "headers": {
        "authorization": token,

        "cache-control": "no-cache",
      },
      contentType: "application/JSON",
      dataType: 'json',
      data: JSON.stringify(members),
      success: function (res) {
        console.log(res);

        for (var i = 0; i < res.length; i++) {
          if (groupadmin == loginpersonid) {
            var friendlist = $('.groupmemberlist');
            friendlist.append('<li style="list-style: none; "><img src="' + res[i].img + '"  class="memberimage"><p class="membername"  id="membername">' + res[i].name + '</p><label class="label1" style="float:right;"><input  class="label__checkbox" type="checkbox" value =' + res[i].name + ' /><span class="label__text"><span class="label__check"><i class="fa fa-check"></i></span></span></label></li>');
          } else {
            $(".kicktext").css({ "display": "none" });
            $("#kickmember").css({ "display": "none" });
            var friendlist = $('.groupmemberlist');
            friendlist.append('<li style="list-style: none; "><img src="' + res[i].img + '"  class="memberimage"><p class="membername"  id="membername">' + res[i].name + '</p></li>');
          }
        }
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
      }
    });
  });

  /*kick group member api */
  $("#kickmember").on("click", function () {
    var allVals = [];
    var splitArr = [];

    var groupmembers = localStorage.getItem("groupmembers");

    var groupid = localStorage.getItem("groupid");
    splitArr = groupmembers.split(',');
    var token = localStorage.getItem("token");

    Array.prototype.remove = function (elem) {
      var indexElement = this.findIndex(el => el === elem);
      if (indexElement != -1)
        this.splice(indexElement, 1);
      return this;
    };
    $('input:checkbox[type=checkbox]:checked').each(function () {
      allVals.push($(this).val());
      splitArr.remove($(this).val());
    });

    console.log("allvalues" + allVals);
    console.log("splitarr" + splitArr);

    var kickmembersname = { kickmember: allVals, groupid: groupid };
    localStorage.setItem("groupmembers", splitArr);
    $.ajax({
      type: 'POST',
      async: true,
      crossDomain: true,
      url: baseUrl+'kickmemberlist',
      "headers": {
        "authorization": token,
        "cache-control": "no-cache",
      },
      contentType: "application/JSON",
      dataType: 'json',
      data: JSON.stringify(kickmembersname),
      success: function (res) {
        var mkConfig = {
          positionY: 'bottom',
          positionX: 'right',
          max: 5,
          scrollable: true
        };

        mkNotifications(mkConfig);

        mkNoti(
          'Remove Response',
          'Member Removed Successfully',
          {
            status: 'success',
            dismissable: true,
            duration: 5000,
          }
        );
      },
      error: function (jqXHR, textStatus, err) {
        console.log('Ajax repsponse:', textStatus);
      }
    });

   
  });

  /* Groupchatimage click functionality */
  
   $('#editable').on('click',function(){
     var groupname=localStorage.getItem("groupname");
     $("#editable").css({'display':"none"});
     $("#inputgroupname").css({'display':'block'});
     $("#inputgroupname").focus();
      $("#inputgroupname").val(groupname);
});

$("#inputgroupname").focusout(function(){
  localStorage.setItem("groupname",$("#inputgroupname").val())
  $('#editable').html($("#inputgroupname").val());
  $("#inputgroupname").css({'display':'none'});
  $("#editable").css({'display':"block","margin-top":"2px","margin-left":"40px"});
  var newgroupname= localStorage.getItem("groupname");
  var groupid = localStorage.getItem("groupid");
  var token = localStorage.getItem("token");
  var groupname = {newgroupname:newgroupname,groupid:groupid};
  $.ajax({
    type: 'POST',
    async: true,
    crossDomain: true,
    url: baseUrl+'updategroupinfo',
    "headers": {
      "authorization": token,
      "cache-control": "no-cache",
    },
    contentType: "application/JSON",
    dataType: 'json',
    data: JSON.stringify(groupname),
    success: function (res) {
      console.log(res);
      var mkConfig = {
        positionY: 'bottom',
        positionX: 'right',
        max: 5,
        scrollable: true
      };

      mkNotifications(mkConfig);

      mkNoti(
        'Group Update',
        'Groupname Updated Successfully',
        {
          status: 'success',
          dismissable: true,
          duration: 5000,
        }
      );
    },
    error: function (jqXHR, textStatus, err) {
      console.log('Ajax repsponse:', textStatus);
      }
    });
  });
});


