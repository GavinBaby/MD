﻿/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#user_profile_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });

    function getU (pid_){
        var buildId_ = pid_||$p_id.find("#build_q").val();
        //获取楼栋
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Unit_List_ajax.action',
            "data": {state:1,p_id:buildId_},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                $p_id.find("#unit_q").empty();
                $p_id.find("#unit_q").append('<option value="">全部</option>');
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        $p_id.find("#unit_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                    }
                }
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得楼栋数据失败！");
            }
        });
    }
    function getB (pid_){
        var villageId_ = pid_||$p_id.find("#village_q").val();
        //获取楼栋
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Build_List_ajax.action',
            "data": {state:1,p_id:villageId_},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                $p_id.find("#build_q").empty();
                $p_id.find("#build_q").append('<option value="">全部</option>');
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        $p_id.find("#build_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                    }
                    getU(data.rows[0].seqNo);
                    $p_id.find("#build_q").on("change",function(){
                        getU();
                    })
                }

            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得楼栋数据失败！");
            }
        });
    }
    function getV (pid_){
        var areaId_ = pid_||$p_id.find("#area_q").val();
        //获取楼栋
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Village_List_ajax.action',
            "data": {state:1,p_id:areaId_},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                $p_id.find("#village_q").empty();
                $p_id.find("#village_q").append('<option value="">全部</option>');
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        $p_id.find("#village_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                    }
                    getB(data.rows[0].seqNo);
                    $p_id.find("#village_q").on("change",function(){
                        getB();
                    })
                }

            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得楼栋数据失败！");
            }
        });
    }
    //抄表区域
    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Area_List_ajax.action',
        "data": {state:1,p_id:sys_pId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#area_q").empty();
            $p_id.find("#area_q").append('<option value="">全部</option>');
            if(data&&data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#area_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
                getV (data.rows[0].seqNo)
                $p_id.find("#area_q").on("change",function(){
                    getV ()
                })
            }


        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
        }
    });





//查询（绘画表格）
    function into() {
        var num_size = 0;
        var params = { // 查询查询参数
            company:sys_pId,//公司
            areaId:$p_id.find("#area_q").val(),//区域id
            villageId:$p_id.find("#village_q").val(),//小区id
            buildId:$p_id.find("#build_q").val(),//楼栋id
            unitId:$p_id.find("#unit_q").val(),//单元id
            doorplate:$p_id.find("#doorplate_q").val(),//门牌
            id:$p_id.find("#id_q").val(),//表具
            location:$p_id.find("#location_q").val(),//地址
            userid:$p_id.find("#userid_q").val(),//户主编号
            username:$p_id.find("#username_q").val()//户主名称
        };
        var table_src = $p_id.find('#area_Table'); // 定义指向
        var ajax_url = '/watermeter/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "userid"},
            {"col_id": "username"},
            {"col_id": "location"},
            {"col_id": "id"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 2,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 3,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        var $p_id = $("#control_operation_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        //编辑
        var $p_id = $("#control_operation_page");
        return data;
    }
//页面加载时自动调用查询的方法
   into();
//搜索后列表重构
    $p_id.find("#employeeSeatchBut").on("click", function () {
        into();
    });


});

