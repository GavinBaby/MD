/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    var new_seq_no;
    var new_num;
    var seq_no;
    var $p_id = $("#home_page");
    $("select").select2({
        minimumResultsForSearch: Infinity   //隐藏下拉列表搜索框。Infinity可以数字替换，下拉列表项的最少条目数等于该数字时出现搜索框。
    }); // 美化下拉列表

    //初始化
    $.ajax({
        type: "get",
        url: '/sysSet/info',
        dataType: "json",
        data: {},
        success: function (data) {
            $("#home_title1").val(data.data.home_title1)
            $("#home_title2").val(data.data.home_title2)
            $("#home_about_content").val(data.data.home_about_content)
            $("#callUs_as").val(data.data.callUs_as)
            $("#callUs_zip").val(data.data.callUs_zip)
            $("#callUs_telephone").val(data.data.callUs_telephone)
            $("#callUs_email").val(data.data.callUs_email)
            $("#map_longitude").val(data.data.map_longitude)
            $("#map_latitude").val(data.data.map_latitude)
            if(data.data.home_about_img){
                add_top_img1(data.data.home_about_img);
            }
            if(data.data.home_img){
                var urls = data.data.home_img.split(',');
                for(var i=0;i<urls.length;i++){
                    add_top_img(urls[i])
                }
            }
        },
        error: function (data) {
            Showbo.Msg.alert("系统错误");
        }
    });

    //保存
    $('#save_data').on('click', function () {
        var params = {
            home_title1:$("#home_title1").val(),
            home_title2:$("#home_title2").val(),
            home_about_content:$("#home_about_content").val(),
            callUs_as:$("#callUs_as").val(),
            callUs_zip:$("#callUs_zip").val(),
            callUs_telephone:$("#callUs_telephone").val(),
            callUs_email:$("#callUs_email").val(),
            home_about_img:$("#img_cover1").attr('src'),
            home_img:""
        };

        $('#img_cover_ul').find("img").each(function(){
            params.home_img+=$(this).attr('src')+","
        });
        if(params.home_img.length>1){
            params.home_img = params.home_img.substring(0,params.home_img.length-1);
        }
        $.ajax({
            type: "post",
            url: '/sysSet/update',
            dataType: "json",
            data: params,
            success: function (data) {
                Showbo.Msg.alert("保存成功！");
                window.location.reload();
            },
            error: function (data) {
                Showbo.Msg.alert("系统错误");
            }
        });
    });

    var picClient =new PicClient();
    //添加头部图片
    function add_top_img(top_img_url){
        $p_id.find("#img_cover_ul").append('<li class="alert alert-dismissable"> ' +
            '<strong> ' +
            '<img name="img_cover" src="'+top_img_url+'" alt="" width="160" height="110"> ' +
            '<span class="mask mask-cover">展示图片</span> <button type="button" class="close closefirst" data-dismiss="alert"></button> </strong> ' +
            '</li>');
    }

    picClient.addsingles(['add_top_img'],function callback(date1,date2,date3){
        setTimeout(function () {
            var data_url =JSON.parse(date2).date;
            var filedata = JSON.parse(date2).date.split(".")[JSON.parse(date2).date.split(".").length-1];
            if('jpg,JPG,jpeg,JPEG,png,PNG'.indexOf(filedata) > -1){format_url = 'jpg'
            }else{
                format_url = 'unknow';
                $p_id.find("#unknow").css('margin','-44px 0px 0px -56px');
                $p_id.find("#unknow").html(filedata);
                $p_id.find("#unknow").show();
            };
            add_top_img('/upload/'+data_url);
        }, 1000);
    })

    //添加品牌故事介绍图片
    function add_top_img1(top_img_url){
        $p_id.find("#img_cover_ul1").empty();
        $p_id.find("#img_cover_ul1").append('<li class="alert alert-dismissable"> ' +
            '<strong> ' +
            '<img id="img_cover1" src="'+top_img_url+'" alt="" width="160" height="110"> ' +
            '<span class="mask mask-cover">展示图片</span> <button type="button" class="close closefirst" data-dismiss="alert"></button> </strong> ' +
            '</li>');
    }

    picClient.addsingles(['add_top_img1'],function callback(date1,date2,date3){
        setTimeout(function () {
            var data_url =JSON.parse(date2).date;
            var filedata = JSON.parse(date2).date.split(".")[JSON.parse(date2).date.split(".").length-1];
            if('jpg,JPG,jpeg,JPEG,png,PNG'.indexOf(filedata) > -1){format_url = 'jpg'
            }else{
                format_url = 'unknow';
                $p_id.find("#unknow").css('margin','-44px 0px 0px -56px');
                $p_id.find("#unknow").html(filedata);
                $p_id.find("#unknow").show();
            };
            add_top_img1('/upload/'+data_url);
        }, 1000);
    })

    //日历控件
//    var nowTemp = new Date();
//    var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    $('.j_datebetween').each(function (i, n) {
        var $date = $(n).find('.j_datepicker');
        var checkin = $date.eq(0).datepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            autoclose: true
        }).on('changeDate', function (ev) {
            //if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate() + 1);
            checkout.setDate(newDate);
            checkout.setStartDate(newDate);
            //}
            $date.eq(1).focus();
        }).data('datepicker');

        var checkout = $date.eq(1).datepicker({
            format: 'yyyy-mm-dd',
            language: 'zh-CN',
            autoclose: true
        }).data('datepicker');
    });
});





