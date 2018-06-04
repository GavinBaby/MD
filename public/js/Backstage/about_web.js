/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    //初始化
    $.ajax({
        type: "get",
        url: '/sysSet/info',
        dataType: "json",
        data: {},
        success: function (data) {
            $("#about_title1").html(data.data.about_title1)
            $("#about_title2").html(data.data.about_title2)
            if(data.data.about_img){
                $("#about_img").attr("style","background: url('icon/hedPic.jpg')")
            }
            if(data.data.about_content){
                $("#about_content").empty();
                $("#about_content").append(data.data.about_content);
            }
        },
        error: function (data) {
            Showbo.Msg.alert("系统错误");
        }
    });

    //初始化
    $.ajax({
        type: "get",
        url: '/navigation/list?sortName=sort',
        dataType: "json",
        data: {},
        success: function (data) {
            $("#top_href").empty();
            for(var i=0;i<data.data.length;i++){

                $("#top_href").append('<a href="'+data.data[i].href+'"><div class="Navigation">'+data.data[i].name+'</div></a>');
            }
        },
        error: function (data) {
            Showbo.Msg.alert("系统错误");
        }
    });
});





