/**
 * Created by admin on 2015/12/30.
 */
//var transport = new Thrift.Transport("/auth/auth");
//var protocol  = new Thrift.Protocol(transport);
//var client    = new authSvcClient(protocol);

$(function() {



    //µÇÂ¼ÑéÖ¤
    $("#loginbutton").on("click",function(){
        $('#loginform').submit();
    })
});