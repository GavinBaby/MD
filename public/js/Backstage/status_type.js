/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    var $p_id = $("#status_type_page");
//弹出框居中
    $p_id.find('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });


    //查询（绘画表格）
    function into() {
        var num_size = 0;
        var params = { // 查询查询参数
            sysSet : $p_id.find("#sysSet").val(),
            parentName:$p_id.find("#parentName").val(),
            parentEn:$p_id.find("#parentEn").val(),
            createUser:sys_username
        };

        var table_src = $p_id.find('#value_Table1'); // 定义指向
        var ajax_url = '/status_type/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 5 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "sysSet"},
            {"col_id": "parentName"},
            {"col_id": "parentEn"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center employee_child" style="font-size: 14px;color: #0000cc;cursor:pointer;" data-id="'+full.seqNo+'">'+data+'</div></td>';

            }
        }, {
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center employee_child" data-id="'+full.seqNo+'" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 2,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center employee_child" data-id="'+full.seqNo+'" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 3,
            "html": function (data, type, full) {
                return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>'+
                    '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                    '<li><a class="employee_edit"  href="javascript:void(0)"  data-id="'+full.seqNo+'"  data-toggle="modal">更改</a></li>'+
                    '<li><a class="employee_del" href="javascript:void(0)"  data-id="'+full.seqNo+'"   data-toggle="modal">删除</a></li>' +
                    '   </ul></div></td>';
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        var $p_id = $("#status_type_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        var $p_id = $("#status_type_page");
        //编辑
        $p_id.find('#value_Table1').find(".employee_edit").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#seq_no").val($(this).attr("data-id"));
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Statustype_List_ajax.action',
                "data": {seqNo:$(this).attr("data-id")},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    if(data&&data.rows.length>0){
                        $p_id.find("#a_sysset").val(data.rows[0].sysSet);
                        $p_id.find("#a_parentname").val(data.rows[0].parentName);
                        $p_id.find("#a_parenten").val(data.rows[0].parentEn);
                    }
                    $p_id.find("#addModal").modal('show');
                },
                "error": function (data) {
                    $p_id.find("#addAreaModal").modal('hide');
                    Showbo.Msg.alert("系统错误！");
                    console.log(data);
                    holdSubmit = true;
                }
            });
        });

        //删除
        $p_id.find('#value_Table1').find(".employee_del").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureDel").modal('show');
        });

        $p_id.find('#value_Table1').find(".employee_child").on("click", function () {
            $p_id.find('#value_Table1').find('tr').css("background","");
            $(this).closest("tr").css("background","#A3BAEE");
            $("#parentId").val($(this).attr('data-id'));
            into_zl();
        });
        return data;
    }
//页面加载时自动调用查询的方法
    into();

//搜索后列表重构
    $p_id.find("#employeeSeatchBut").on("click", function () {
        into();
    });

    //点击添加新数据的触发事件
    $p_id.find("#addStaffModal").on("click", function () {
        $p_id.find("#add_form")[0].reset();
        $p_id.find("#addModal").modal('show');
    });

    var holdSubmit = true;
    //刪除
    $p_id.find("#del_btn").on("click", function () {
        var d_seqno = {seqNo:$p_id.find("#seq_no_edit").val(),createUser:sys_username};
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            $("#popDiv").show();
            $p_id.find("#sureDel").modal('hide');
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Statustype_delete_edit.action',
                "data": d_seqno,
                "jsonp": "callback",
                "jsonpCaback": "handle",
                "success": function (data) {

                    if(data.statejson&&data.statejson.success){
                        into();
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("删除失败！");
                        holdSubmit = true;
                    }
                    $("#popDiv").hide();
                },
                "error": function (data) {
                    $("#popDiv").hide();
                    console.log(data);
                }
            });
        }

    });

    //新建
    function add(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    parentName: $p_id.find('#a_parentname').val(),
                    parentEn: $p_id.find('#a_parenten').val(),
                    createUser:sys_username
                }
                $("#popDiv").show();
                $p_id.find("#addModal").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Statustype_add_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {

                        if(data.statejson&&data.statejson.success){
                            into();
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("保存失败！");
                            holdSubmit = true;
                        }
                        $("#popDiv").hide();
                    },
                    "error": function (data) {
                        $("#popDiv").hide();
                        Showbo.Msg.alert("系统错误！");
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
                    seqNo: $p_id.find('#seq_no').val(),
                    parentName: $p_id.find('#a_parentname').val(),
                    parentEn: $p_id.find('#a_parenten').val(),
                    createUser:sys_username
                }
                $("#popDiv").show();
                $p_id.find("#addModal").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Statustype_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {

                        if(data.statejson&&data.statejson.success){
                            into();
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("更新失败！");
                            holdSubmit = true;
                        }
                        $("#popDiv").hide();
                    },
                    "error": function (data) {

                        holdSubmit = true;
                        Showbo.Msg.alert("系统错误！");
                        $("#popDiv").hide();
                    }
                });
            }
        }
    }
    //保存或更新
    $p_id.find("#save_btn").on("click", function () {
        if($p_id.find("#seq_no").val()&&$p_id.find("#seq_no").val()!=""){
            update();
        }else{
            add();
        }
    });



//子类查询方法
    function into_zl(){
        $p_id.find("#mapping_div2").css("display","block");
        var num_size = 0;
        var params = { // 查询查询参数
            sysSet : $p_id.find("#sysSetzl_q").val(),
            childName:$p_id.find("#childName_q").val(),
            parentId:$p_id.find("#parentId").val(),
            createUser:sys_username
        };

        var table_src = $p_id.find('#value_Table2'); // 定义指向
        var ajax_url = '/status_type_c/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 5 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "sysSet"},
            {"col_id": "childName"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center employee_child" style="font-size: 14px;">'+data+'</div></td>';

            }
        }, {
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center employee_child" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 2,
            "html": function (data, type, full) {
                return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>'+
                    '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                    '<li><a class="employee_edit"  href="javascript:void(0)"  data-id="'+full.seqNo+'"  data-toggle="modal">更改</a></li>'+
                    '<li><a class="employee_del" href="javascript:void(0)"  data-id="'+full.seqNo+'"   data-toggle="modal">删除</a></li>' +
                    '   </ul></div></td>';
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback_zl,fnDrawCallback_zl);
    }

    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback_zl(data){
        var $p_id = $("#status_type_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback_zl(data){
        var $p_id = $("#status_type_page");
        //编辑
        $p_id.find('#value_Table2').find(".employee_edit").on("click",function () {
            var seqNo = $(this).attr("data-id");
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#seq_no_zl").val($(this).attr("data-id"));
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Statustype_Listzl_ajax.action',
                "data": {sysSet:seqNo},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    if(data&&data.rows.length>0){
                        $p_id.find("#sysSet_zl").val(data.rows[0].sysSet);
                        $p_id.find("#childName").val(data.rows[0].childName);
                    }
                    $p_id.find("#addModalzl").modal('show');
                },
                "error": function (data) {
                    Showbo.Msg.alert("系统错误，获取数据失败！");
                }
            });
        });
        //删除
        $p_id.find('#value_Table2').find(".employee_del").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureDel").modal('show');
        });
        return data;
    }

    //子类搜索按钮
    $p_id.find("#employeeSeatchBut_zl").on("click", function () {
        into_zl();
    });
    //小类新增触发事件
    $("#addStaffModalzl").on("click", function () {
        $("#addzl_form")[0].reset();
        $("#addModalzl").modal('show');
    });

    //新建
    function add_zl(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    childName: $p_id.find('#childName').val(),
                    parentId: $p_id.find('#parentId').val(),
                    createUser:sys_username
                }
                $("#popDiv").show();
                $p_id.find("#addModalzl").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Statustype_addzl_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {

                        if(data.statejson&&data.statejson.success){
                            into_zl();
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("保存失败！");
                            holdSubmit = true;
                        }
                        $("#popDiv").hide();
                    },
                    "error": function (data) {

                        Showbo.Msg.alert("系统错误！");
                        $("#popDiv").hide();
                        holdSubmit = true;
                    }
                });
            }
        }
    }
    //更新
    function update_zl(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    seqNo: $p_id.find('#seq_no_edit').val(),
                    childName: $p_id.find('#childName').val(),
                    createUser:sys_username
                }
                $("#popDiv").show();
                $p_id.find("#addModalzl").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Statustype_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {

                        if(data.statejson&&data.statejson.success){
                            into_zl();
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("更新失败！");
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
        }
    }
    //保存或更新
    $p_id.find("#save_btn_zl").on("click", function () {
        if($p_id.find("#seq_no_zl").val()&&$p_id.find("#seq_no_zl").val()!=""){
            update_zl();
        }else{
            add_zl();
        }
    });


});

