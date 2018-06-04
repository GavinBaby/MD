/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#meter_reading_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });

    $p_id.find("#area_q").val(temporary_aid);
    $p_id.find("#village_q").val(temporary_vid);
    $p_id.find("#cid_q").val(temporary_cid);
    var init_frist = true;

    //查询（绘画表格）
    function into() {
        var num_size = 0;
        if(init_frist){
            init_frist=false;
            var params = { // 查询查询参数
                company:sys_pId,//公司
                areaId:temporary_aid,//区域id
                villageId:temporary_vid,//小区id
                id:$p_id.find("#cid_q").val(),//采集器
                location:$p_id.find("#location_q").val()//安装位置
            };
        }else{
            var params = { // 查询查询参数
                company:sys_pId,//公司
                areaId:$p_id.find("#area_q").val(),//区域id
                villageId:$p_id.find("#village_q").val(),//小区id
                id:$p_id.find("#cid_q").val(),//采集器
                location:$p_id.find("#location_q").val()//安装位置
            };
        }

        var table_src = $p_id.find('#area_Table'); // 定义指向
        var ajax_url = '/collector/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "seqNo"},
            {"col_id": "id"},
            {"col_id": "name"},
            {"col_id": "villageName"},
            {"col_id": "location"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-left" style="font-size: 14px;"><input data-no="'+full.seqNo+'" data-id="'+full.id+'"  data-phone="'+full.telephone+'" class="checkbox_cb" value="'+data+'" class="text-center" type="checkbox" style=" margin-left:25px "></div></td>';

            }
        }, {
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
        },{
            "colIndex": 4,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 5,
            "html": function (data, type, full) {
                return  '<td><div class="drop-opt"><a class="employee_edit"  href="javascript:void(0)" data-no="'+full.seqNo+'" data-id="'+full.id+'"  data-phone="'+full.telephone+'" data-toggle="modal">抄表</a></div></td>';
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        var $p_id = $("#meter_reading_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        var $p_id = $("#meter_reading_page");
        //抄表
        $p_id.find(".employee_edit").on("click",function () {
            $("#popDiv").show();
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Collectorrecord_add_edit.action',
                "data": { seqNolist:$(this).attr("data-no"),createUser:sys_username},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    $("#popDiv").hide();
                    if(data.statejson&&data.statejson.success){
                        var seqlist = data.statejson.seqlist;
                        $.ajax({
                            "dataType": 'json',
                            "type": "get",
                            "async": false,
                            "url": '/readinglist',
                            "data": { seqlist:seqlist},
                            "success": function (data) {
                                $.learuntab.addTab("9999","/console?seqlist="+seqlist,"控制台");
                            },
                            "error": function (data) {
                                Showbo.Msg.alert("系统错误！");
                            }
                        });
                    }else {
                        Showbo.Msg.alert("系统错误！");
                    }
                },
                "error": function (data) {
                    $("#popDiv").hide();
                    Showbo.Msg.alert("系统错误！");
                }
            });
            /*$p_id.find("#waitModal").modal('show');

            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Meterread_Reading_edit.action',
                "data": { seqNo:$(this).attr("data-no"),cid:$(this).attr("data-id"),telephone:$(this).attr("data-phone"),createUser:sys_username},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    debugger;
                    if(data.statejson&&data.statejson.success){
                        $p_id.find("#show_text").html('<p class="text-center font-18 wryh text-gray-light">抄表成功</p>');
                    }else {
                        $p_id.find("#show_text").html('<p class="text-center font-18 wryh text-gray-light">抄表失败,通讯结果：'+data.statejson.errText+'</p>');
                    }
                    setTimeout(function () {
                        $p_id.find("#waitModal").modal('hide');
                            setTimeout(function () {
                                $p_id.find("#show_text").html('<p class="text-center font-18 wryh text-gray-light">抄表执行中。。。。。。</p><p class="text-center font-18 wryh text-gray-light">请等待</p>');
                                $.learuntab.addTab("2063","/reading_record","抄表记录");
                            }, 500);

                    }, 1000);

                },
                "error": function (data) {
                    $p_id.find("#sureStart").modal('hide');
                    holdSubmit = true;
                    Showbo.Msg.alert("系统错误！");
                    console.log(data);

                }
            });*/





        });
        return data;
    }
//页面加载时自动调用查询的方法

    into();

    function getC (pid_){
        var vid_ = pid_||$p_id.find("#village_q").val();
        //获取采集器
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Collector_List_ajax.action',
            "data": {villageId:vid_},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {

                $p_id.find("#cid_q").empty();
                $p_id.find("#cid_q").append('<option value="">全部</option>');
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        $p_id.find("#cid_q").append('<option value="'+data.rows[i].id+'">'+data.rows[i].name+'</option>');
                    }
                    if(temporary_cid&&init_frist){
                        $p_id.find("#cid_q").val(temporary_cid);
                    }
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
                    if(temporary_vid){
                        $p_id.find("#village_q").val(temporary_vid);
                        getC();
                    }else{
                        getC(data.rows[0].seqNo);
                    }
                    $p_id.find("#village_q").on("change",function(){
                        getC();
                    })
                }

            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得楼栋数据失败！");
            }
        });
    }

    var aid_seq_no= temporary_aid||sys_areaId
    //抄表区域
    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Area_List_ajax.action',
        "data": {state:1,p_id:sys_pId,seq_no: aid_seq_no},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#area_q").empty();
            $p_id.find("#area_q").append('<option value="">全部</option>');
            if(data&&data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#area_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
                if(aid_seq_no){
                    $p_id.find("#area_q").val(aid_seq_no);
                    getV();
                }else{
                    getV (data.rows[0].seqNo)
                }

                $p_id.find("#area_q").on("change",function(){
                    getV ()
                })
            }


        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
        }
    });







//搜索后列表重构
    $p_id.find("#employeeSeatchBut").on("click", function () {
        into();
    });


    //全选check_all
    $p_id.find("#check_all").on("click", function () {
        if($(this).is(':checked')) {
            $p_id.find("#area_Table").each(function(){
                $(this).find("tr").find(".checkbox_cb").attr("checked","true");
            })
        }else{
            $p_id.find("#area_Table").each(function(){
                $(this).find("tr").find(".checkbox_cb").removeAttr("checked");
            })
        }

    });



    $p_id.find("#batch_btn").on("click", function () {
        $p_id.find("#sureStart").modal('show');
        var seqNos = "";
        var each_num = $p_id.find("#area_Table").find("tbody").find("tr").length;
        var frist_checked=true;
        $p_id.find("#area_Table").find("tbody").find("tr").each(function(index,element){
            if($(this).find(".checkbox_cb").is(':checked')) {
                if(frist_checked){
                    frist_checked =false;
                    seqNos+=$(this).find(".employee_edit").attr("data-no");
                }else{
                    seqNos+=","+$(this).find(".employee_edit").attr("data-no");
                }
                //if(index!=(each_num-1))
            }
        })
        if(seqNos){
            $("#popDiv").show();
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Collectorrecord_add_edit.action',
                "data": { seqNolist:seqNos,createUser:sys_username},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {

                    if(data.statejson&&data.statejson.success){
                        var seqlist = data.statejson.seqlist;
                        $.ajax({
                            "dataType": 'json',
                            "type": "get",
                            "async": false,
                            "url": '/readinglist',
                            "data": { seqlist:seqlist},
                            "success": function (data) {
                                $("#popDiv").hide();
                                $.learuntab.addTab("9999","/console?seqlist="+seqlist,"控制台");
                            },
                            "error": function (data) {
                                $("#popDiv").hide();
                                Showbo.Msg.alert("系统错误！");
                            }
                        });
                    }else {
                        $("#popDiv").hide();
                        Showbo.Msg.alert("系统错误！");
                    }
                },
                "error": function (data) {
                    $("#popDiv").hide();
                    Showbo.Msg.alert("系统错误！");
                }
            });
        }

    });

});

