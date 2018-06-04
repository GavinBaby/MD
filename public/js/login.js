//var transport = new Thrift.Transport("/auth/auth");
//var protocol  = new Thrift.Protocol(transport);
//var client    = new authSvcClient(protocol);


$(function() {



  //登录验证
  $("#loginbutton").on("click",function(){
    $('#loginform').submit();
  })
  //  $.ajax({
  //    type: "GET",
  //    url: "/product/content",
  //    dataType: "json",
  //    data: {username:$("#username").val(),password:$("#password").val()},
  //    success: function (data) {
  //
  //    }
  //  })
  //  $.ajxa($("#username").val(), $("#password").val(), 1, function(res) {
  //    var result = res.res_state;
  //    if(result.code){
  //      window.location.href="/index";
  //    }else{
  //      alert(res_state.message);
  //    }
  //  })
  //
  //
  //
  //});

  /**
   * 首页幻灯片
  ********************************/
  $('#j_slide').bxSlider({
    mode: 'fade',
    auto: true,
    speed:1500,
    pause: 4000,
    controls:false
  });
  
  
});