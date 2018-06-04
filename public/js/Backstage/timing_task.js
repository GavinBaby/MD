/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#timing_task_page")
    //日历控件
    //var nowTemp = new Date();
    //var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    $p_id.find('.form_datetime').each(function (i, n) {
        var $date = $(n).find('.datepicker');

        var checkin = $date.eq(0).datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-TW',
            autoclose: true
        }).on('changeDate', function (ev) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate());
        }).data('datetimepicker');
        $date.eq(0).on("click",function(){
            if($(this).is(":focus")){
                $(this).blur();
            }
        });

    });

    $p_id.find("#cyctype").on("change",function(){
        if($(this).val()==1){
            $p_id.find("#time_div1").css("display","block");
            $p_id.find("#time_div2").css("display","none");
            $p_id.find("#time_div3").css("display","none");
        }else if($(this).val()==2){
            $p_id.find("#time_div1").css("display","none");
            $p_id.find("#time_div2").css("display","block");
            $p_id.find("#time_div3").css("display","none");
        }else{

            $p_id.find("#time_type").html($(this).find("option:selected").text())
            $p_id.find("#time_div1").css("display","none");
            $p_id.find("#time_div2").css("display","none");
            $p_id.find("#time_div3").css("display","block");
        }
    })
    //弹出框居中
    $p_id.find('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });


    //抄表区域
    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Area_List_ajax.action',
        "data": {state:1,p_id:sys_pId,seq_no:sys_areaId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#aid").empty();
            if(data&&data.rows.length>0){
                if(data.rows.length>1){
                    $p_id.find("#aid").append('<option value="">全部</option>');
                }
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#aid").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
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
            name:$p_id.find("#name_q").val(),//任务名称
            tasktype:$p_id.find("#type_q").val(),//任务类型
            cyctype:$p_id.find("#cyctype_q").val(),//任务周期
            status:$p_id.find("#status_q").val()//任务状态
        };
        var table_src = $p_id.find('#area_Table'); // 定义指向
        var ajax_url = '/timing_task/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "name"},
            {"col_id": "typename"},
            {"col_id": "cysname"},
            {"col_id": "jname"},
            {"col_id": "state"}
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
        },{
            "colIndex": 4,
            "html": function (data, type, full) {
                if(data==1){
                    return  '<td><div class="text-center" style="font-size: 14px;">正常</div></td>';
                }else{
                    return  '<td><div class="text-center" style="font-size: 14px;">停用</div></td>';
                }
            }
        },{
            "colIndex": 5,
            "html": function (data, type, full) {
                if(full.state==1){
                    return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>'+
                        '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                        '<li><a class="employee_edit"  href="javascript:void(0)" data-id="'+full.seqNo+'" data-toggle="modal">更改</a></li>'+
                        '<li><a class="employee_stop"  href="javascript:void(0)" data-id="'+full.seqNo+'" data-toggle="modal">停用</a></li>'+
                        '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seqNo+'"   data-toggle="modal">删除</a></li>' +
                        '   </ul></div></td>';
                }else{
                    return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>'+
                        '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                        '<li><a class="employee_edit"  href="javascript:void(0)" data-id="'+full.seqNo+'" data-toggle="modal">更改</a></li>'+
                        '<li><a class="employee_start"  href="javascript:void(0)" data-id="'+full.seqNo+'" data-toggle="modal">启用</a></li>'+
                        '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seqNo+'"   data-toggle="modal">删除</a></li>' +
                        '   </ul></div></td>';
                }
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        var $p_id = $("#timing_task_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        var $p_id = $("#timing_task_page");

        //编辑
        $p_id.find(".employee_edit").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#seq_no").val($(this).attr("data-id"));
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Timedtask_List_ajax.action',
                "data": {seqNo:$(this).attr("data-id")},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    if(data&&data.rows.length>0){
                        $p_id.find("#name").val(data.rows[0].name);
                        $p_id.find("#type").val(data.rows[0].type);
                        $p_id.find("#cyctype").val(data.rows[0].cystype);
                        debugger;
                        if(data.rows[0].cystype==1){
                            $p_id.find("#time_div1").css("display","block");
                            $p_id.find("#time_div2").css("display","none");
                            $p_id.find("#time_div3").css("display","none");
                            $p_id.find("#task_datatime").val(data.rows[0].functuinTime);

                        }else if(data.rows[0].cystype==2){
                            $p_id.find("#time_div1").css("display","none");
                            $p_id.find("#time_div2").css("display","block");
                            $p_id.find("#time_div3").css("display","none");
                            if(data.rows[0].functuinTime){
                                $p_id.find("#time_div2").find("#task_time").val(data.rows[0].functuinTime);
                            }
                        }else{
                            $p_id.find("#time_type").html($(this).find("option:selected").text())
                            $p_id.find("#time_div1").css("display","none");
                            $p_id.find("#time_div2").css("display","none");
                            $p_id.find("#time_div3").css("display","block");

                            if(data.rows[0].functuinTime){
                                $p_id.find("#time_div3").find("#task_time").val(data.rows[0].functuinTime.substr(str.length-5));
                            }
                            $p_id.find("#time_div3").find("#task_month").val(data.rows[0].functuinDay);

                        }
                        $p_id.find("#aid").val(data.rows[0].jid);
                        $p_id.find("#state").val(data.rows[0].state);

                    }
                    $p_id.find("#addAccountModal").modal('show');
                },
                "error": function (data) {
                    $p_id.find("#addAccountModal").modal('hide');
                    Showbo.Msg.alert("系统错误！");
                    console.log(data);
                    holdSubmit = true;
                }
            });
            $p_id.find("#addAccountModal").modal('show');
            $p_id.find("#save_account").on("click",function () {
                $p_id.find("#addAccountModal").modal('hide');
            });
        });


        //删除
        $p_id.find(".employee_del").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureDel").modal('show');
        });
        //停用
        $p_id.find(".employee_stop").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureStop").modal('show');
        });
        //停用
        $p_id.find(".employee_start").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureStart").modal('show');
        });
        return data;
    }
//页面加载时自动调用查询的方法
   into();
//搜索后列表重构
    $p_id.find("#employeeSeatchBut").on("click", function () {
        into();
    });

    //新建
    function add(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                 var  addlist = {
                 name: $p_id.find('#name').val(),
                 tasktype: $p_id.find('#type').val(),
                 typename: $p_id.find('#type').find("option:selected").text(),
                 cystype: $p_id.find('#cyctype').val(),
                 cysname: $p_id.find('#cyctype').find("option:selected").text(),
                 jid: $p_id.find('#aid').val(),
                 jname: $p_id.find('#aid').find("option:selected").text(),
                 company:sys_pId,
                 createUser:sys_username
                 }
                if(addlist.cystype==1){
                    addlist.functuinTime=$p_id.find("#task_datatime").val();
                }else if(addlist.cystype==2){
                    addlist.functuinTime=$p_id.find("#time_div2").find("#task_time").val();
                }else{
                    addlist.functuinTime=$p_id.find("#time_div3").find("#task_month").val()+" "+$p_id.find("#time_div3").find("#task_time").val();
                    addlist.functuinDay=$p_id.find("#time_div3").find("#task_month").val()
                }
                $("#popDiv").show();
                $p_id.find("#addAccountModal").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Timedtask_add_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        if(data.statejson&&data.statejson.success){
                            Showbo.Msg.alert("保存成功！");

                            $('.tabReload').trigger("click");
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("区域名称重复！");
                            $("#popDiv").hide();
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("保存失败！");
                            $("#popDiv").hide();
                            holdSubmit = true;
                        }

                    },
                    "error": function (data) {
                        Showbo.Msg.alert("系统错误！");
                        $("#popDiv").hide();
                        console.log(data);
                        holdSubmit = true;
                    }
                });
            }
        }
    }
    //更新
    function update(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    seqNo:$p_id.find('#seq_no_edit').val(),
                    name: $p_id.find('#name').val(),
                    type: $p_id.find('#type').val(),
                    typename: $p_id.find('#type').find("option:selected").text(),
                    cystype: $p_id.find('#cyctype').val(),
                    cysname: $p_id.find('#cyctype').find("option:selected").text(),
                    jid: $p_id.find('#aid').val(),
                    jname: $p_id.find('#aid').find("option:selected").text(),
                    createUser:sys_username
                }
                if(addlist.cystype==1){
                    addlist.functuinTime=$p_id.find("#task_datatime").val();
                }else if(addlist.cystype==2){
                    debugger;
                    addlist.functuinTime=$p_id.find("#time_div2").find("#task_time").val();
                }else{
                    addlist.functuinTime=$p_id.find("#time_div3").find("#task_month").val()+" "+$p_id.find("#time_div3").find("#task_time").val();
                }
                $("#popDiv").show();
                $p_id.find("#addAccountModal").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Timedtask_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        if(data.statejson&&data.statejson.success){
                            $('.tabReload').trigger("click");
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("区域名称重复！");
                            $("#popDiv").hide();
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("更新失败！");
                            $("#popDiv").hide();
                            holdSubmit = true;
                        }
                    },
                    "error": function (data) {
                        holdSubmit = true;
                        Showbo.Msg.alert("系统错误！");
                        $("#popDiv").hide();
                        console.log(data);

                    }
                });
            }
        }
    }

    // 默认允许提交
    var holdSubmit = true;
    //添加和编辑窗口中的确认事件
    $p_id.find("#save_task").on("click", function () {
        if($p_id.find("#seq_no").val()&&$p_id.find("#seq_no").val()!=""){
            update();
        }else{
            add();
        }
    });


    //启用
    $p_id.find("#start_button").on("click",function () {
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            var  addlist = {
                seqNo: $p_id.find('#seq_no_edit').val(),
                state:1
            }
            $("#popDiv").show();
            $p_id.find("#sureStart").modal('hide');
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Timedtask_update_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {

                    if(data.statejson&&data.statejson.success){
                        $('.tabReload').trigger("click");
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("启用失败！");
                        holdSubmit = true;
                    }
                    $("#popDiv").hide();
                },
                "error": function (data) {
                    holdSubmit = true;
                    Showbo.Msg.alert("系统错误！");
                    $("#popDiv").hide();
                    console.log(data);

                }
            });
        }
    });
    //停用
    $p_id.find("#stop_button").on("click",function () {
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            var  addlist = {
                seqNo: $p_id.find('#seq_no_edit').val(),
                state:2
            }
            $("#popDiv").show();
            $p_id.find("#sureStop").modal('hide');
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Timedtask_update_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {

                    if(data.statejson&&data.statejson.success){
                        $('.tabReload').trigger("click");
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("停用失败！");
                        holdSubmit = true;
                    }
                    $("#popDiv").hide();
                },
                "error": function (data) {
                    holdSubmit = true;
                    Showbo.Msg.alert("系统错误！");
                    $("#popDiv").hide();
                    console.log(data);

                }
            });
        }
    });
    //删除
    $p_id.find("#del_button").on("click",function () {
        $p_id.find("#sureDel").modal('hide');
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            var  addlist = {
                seqNo: $p_id.find('#seq_no_edit').val()
            }
            $("#popDiv").show();
            $p_id.find("#sureDel").modal('hide');
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Timedtask_delete_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {

                    if(data.statejson&&data.statejson.success){
                        Showbo.Msg.alert("删除成功！");
                        $('.tabReload').trigger("click");
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("删除失败！");
                        holdSubmit = true;
                    }
                    $("#popDiv").hide();
                },
                "error": function (data) {
                    Showbo.Msg.alert("系统错误！");
                    $("#popDiv").hide();
                    console.log(data);
                    holdSubmit = true;
                }
            });
        }
    });


    //添加区域弹窗
    $p_id.find("#addStaffModal").on("click",function () {
        $p_id.find('#seq_no').val("");
        $p_id.find('#add_form')[0].reset();
        $p_id.find("#addAccountModal").modal('show');
    });

});

