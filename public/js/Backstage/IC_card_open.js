/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#IC_card_open");

    $p_id.find("#init_card").on("click",function(){

        Showbo.Msg.alert("初始化成功");
        //开卡初始化
/*        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Ic_add_ajax.action',
            "data": {state:1,seqNo:sys_village_id},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {

            },
            "error": function (data) {

            }
        });*/
    })

    $p_id.find("#write_card").on("click",function(){
        $('#ajax-loader').show();
//填写卡信息
/*        $.ajax({
            "dataType": 'jsonp',
            "type": "post",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Ic_edit_ajax.action',
            "data": {state:1,seqNo:sys_village_id},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                $p_id.find("#village").empty();
                if(data&&data.rows.length>0){
                    $p_id.find("#village").append('<option value="'+data.rows[0].seqNo+'">'+data.rows[0].name+'</option>');
                }
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得区域数据失败！");
            }
        });*/
    })


});

