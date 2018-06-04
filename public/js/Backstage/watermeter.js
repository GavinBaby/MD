/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#watermeter_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });

    //获取用水性质
    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/watertype/list',
        "data": {company:sys_pId},
        "success": function (data) {
            $p_id.find("#waterid").empty();
            if(data&&data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#waterid").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
            }else{
                $p_id.find("#waterid").append('<option value="0">暂无</option>');
            }
        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得用水性质失败！");
        }
    });

    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Village_List_ajax.action',
        "data": {state:1,seq_no:sys_village_id},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#village").empty();
            if(data&&data.rows.length>0){

                $p_id.find("#village").append('<option value="'+data.rows[0].seqNo+'">'+data.rows[0].name+'</option>');
            }else{
                $p_id.find("#village").append('<option value="0">暂无</option>');
            }
            //获取楼栋
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Build_List_ajax.action',
                "data": {state:1,p_id:sys_village_id},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    $p_id.find("#build").empty();
                    if(data&&data.rows.length>0){
                        for(var i=0;i<data.rows.length;i++){
                            $p_id.find("#build").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                        }
                    }else{
                        $p_id.find("#build").append('<option value="0">暂无</option>');
                    }
                    //获取楼栋
                    $.ajax({
                        "dataType": 'jsonp',
                        "type": "get",
                        "timeout": 20000,
                        "async": false,
                        "url": sys_client+'/JCSW/web/publicmenus/Unit_List_ajax.action',
                        "data": {state:1,p_id:$p_id.find("#build").val()},
                        "jsonp":"callback",
                        "jsonpCaback":"handle",
                        "success": function (data) {
                            $p_id.find("#unit").empty();
                            if(data&&data.rows.length>0){
                                for(var i=0;i<data.rows.length;i++){
                                    $p_id.find("#unit").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                                }
                            }else{
                                $p_id.find("#unit").append('<option value="0">暂无</option>');
                            }
                        },
                        "error": function (data) {
                            Showbo.Msg.alert("系统错误，获得单元数据失败！");
                        }
                    });

                    $p_id.find("#build").on("change",function(){
                        //获取单元
                        $.ajax({
                            "dataType": 'jsonp',
                            "type": "get",
                            "timeout": 20000,
                            "async": false,
                            "url": sys_client+'/JCSW/web/publicmenus/Unit_List_ajax.action',
                            "data": {state:1,p_id:$(this).val()},
                            "jsonp":"callback",
                            "jsonpCaback":"handle",
                            "success": function (data) {
                                $p_id.find("#unit").empty();
                                if(data&&data.rows.length>0){
                                    for(var i=0;i<data.rows.length;i++){
                                        $p_id.find("#unit").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                                    }
                                }else{
                                    $p_id.find("#unit").append('<option value="0">暂无</option>');
                                }
                            },
                            "error": function (data) {
                                Showbo.Msg.alert("系统错误，获得单元数据失败！");
                            }
                        });
                    })
                },
                "error": function (data) {
                    Showbo.Msg.alert("系统错误，获得楼栋数据失败！");
                }
            });
        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
        }
    });



    //获取表具类型，编号1002
    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Statustype_List_ajax.action',
        "data": {parentId:1002},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#type").empty();
            if(data&&data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#type").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].childName+'</option>');
                }
            }else{
                $p_id.find("#type").append('<option value="0">暂无</option>');
            }
            //获取电池类型，编号1003
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Statustype_List_ajax.action',
                "data": {parentId:1003},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    $p_id.find("#batteryid").empty();
                    if(data&&data.rows.length>0){
                        for(var i=0;i<data.rows.length;i++){
                            $p_id.find("#batteryid").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].childName+'</option>');
                        }
                    }else{
                        $p_id.find("#batteryid").append('<option value="0">暂无</option>');
                    }
                },
                "error": function (data) {
                    Showbo.Msg.alert("系统错误，获得协议类型失败！");
                }
            });
        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得协议类型失败！");
        }
    });








//查询（绘画表格）
    function into() {
        var num_size = 0;
        var params = { // 查询查询参数
            cno:sys_c_no,//采集器id
            jid:sys_jid,//集中器
            id:$p_id.find("#id_q").val(),//id
            name:$p_id.find("#name_q").val(),//名称
            userid:$p_id.find("#userid_q").val(),//id
            username:$p_id.find("#username_q").val(),//名称
            location:$p_id.find("#location_q").val()//所属小区id

        };

        var table_src = $p_id.find('#area_Table'); // 定义指向
        var ajax_url = '/watermeter/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Village_List_ajax.action
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "id"},
            {"col_id": "name"},
            {"col_id": "typename"},
            {"col_id": "caliber"},
            {"col_id": "userid"},
            {"col_id": "username"},
            {"col_id": "location"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';

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
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 6,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return  '<td><div class="text-center" style="font-size: 14px;">'+data+'</div></td>';
            }
        },{
            "colIndex": 7,
            "html": function (data, type, full) {
                return  '<td><div class="drop-opt"><a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>'+
                    '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">'+
                    '<li><a class="employee_edit"  href="javascript:void(0)"  data-id="'+full.seqNo+'" data-name="'+full.name+'" data-toggle="modal">更改</a></li>'+
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
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        //编辑
        $p_id.find(".employee_edit").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#seq_no").val($(this).attr("data-id"));
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Watermeter_List_ajax.action',
                "data": {seqNo:$(this).attr("data-id")},
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    if(data&&data.rows.length>0){
                        $p_id.find("#w_id").val(data.rows[0].id);
                        $p_id.find("#w_name").val(data.rows[0].name);
                        $p_id.find("#village").find("option").each(function(){
                            if($(this).val()==data.rows[0].villageId){
                                $p_id.find("#village").val(data.rows[0].villageId);
                                $p_id.find("#build").val(data.rows[0].buildId);
                                $p_id.find("#unit").val(data.rows[0].unitId);
                            }
                        })
                        $p_id.find("#doorplate").val(data.rows[0].doorplate);
                        $p_id.find("#assetid").val(data.rows[0].assetid);
                        $p_id.find("#waterid").val(data.rows[0].waterid);
                        $p_id.find("#type").val(data.rows[0].type);
                        $p_id.find("#batteryid").val(data.rows[0].batteryid);
                        $p_id.find("#imp").val(data.rows[0].imp);
                        $p_id.find("#caliber").val(data.rows[0].caliber);
                        $p_id.find("#reading1").val(data.rows[0].reading1);
                        $p_id.find("#reading2").val(data.rows[0].reading2);
                        $p_id.find('#userid').val(data.rows[0].userid);
                        $p_id.find('#username').val(data.rows[0].username);
                    }
                    $p_id.find("#addAreaModal").modal('show');
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
        $p_id.find(".employee_del").on("click",function () {

            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#sureDel").modal('show');
        });
        //停用
        $p_id.find(".employee_stop").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#name_edit").val($(this).attr("data-name"));
            $p_id.find("#sureStop").modal('show');
        });
        //停用
        $p_id.find(".employee_start").on("click",function () {
            $p_id.find("#seq_no_edit").val($(this).attr("data-id"));
            $p_id.find("#name_edit").val($(this).attr("data-name"));
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
    //添加区域弹窗
    $p_id.find("#addStaffModal").on("click",function () {
        $p_id.find('#seq_no').val("");
        $p_id.find('#add_form')[0].reset();
        $p_id.find("#addAreaModal").modal('show');
    });
    //新建
    function add(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    id: $p_id.find('#w_id').val(),
                    name: $p_id.find('#w_name').val(),
                    jname: sys_jname,
                    jid:sys_jid,
                    cname: sys_c_name,
                    cid:sys_c_id,
                    cno:sys_c_no,
                    telephone:sys_phone,
                    areaName: sys_aname,
                    areaId:sys_aid,
                    company:sys_pId,
                    villageName: $p_id.find('#village').find("option:selected").text(),
                    villageId:$p_id.find('#village').val(),
                    buildName: $p_id.find('#build').find("option:selected").text(),
                    buildId:$p_id.find('#build').val(),
                    unitName: $p_id.find('#unit').find("option:selected").text(),
                    unitId:$p_id.find('#unit').val(),
                    doorplate:$p_id.find('#doorplate').val(),
                    userid:$p_id.find('#userid').val(),
                    username:$p_id.find('#username').val(),
                    assetid:$p_id.find('#assetid').val(),
                    waterid:$p_id.find('#waterid').val(),
                    watername:$p_id.find('#waterid').find("option:selected").text(),
                    type:$p_id.find('#type').val(),
                    typename:$p_id.find('#type').find("option:selected").text(),
                    batteryid:$p_id.find('#batteryid').val(),
                    batteryname:$p_id.find('#batteryid').find("option:selected").text(),
                    imp:$p_id.find('#imp').val(),
                    caliber:$p_id.find('#caliber').val(),
                    reading1:$p_id.find('#reading1').val(),
                    reading2:$p_id.find('#reading2').val(),
                    location:$('#sys_aname').val()+$p_id.find('#village').find("option:selected").text()+$p_id.find('#build').find("option:selected").text()+$p_id.find('#unit').find("option:selected").text()+$p_id.find('#doorplate').val(),
                    createUser:sys_username
                }
                $("#popDiv").show();
                $p_id.find("#addAreaModal").modal('hide');
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Watermeter_add_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        if(data.statejson&&data.statejson.success){
                            Showbo.Msg.alert("保存成功！");
                            into();
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("区域名称重复！");
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
                    seqNo: $p_id.find('#seq_no').val(),
                    id: $p_id.find('#w_id').val(),
                    name: $p_id.find('#w_name').val(),
                    jname: sys_jname,
                    jid:sys_jid,
                    cname: sys_c_name,
                    cid:sys_c_id,
                    areaName: sys_aname,
                    areaId:sys_aid,
                    villageName: $p_id.find('#village').find("option:selected").text(),
                    villageId:$p_id.find('#village').val(),
                    buildName: $p_id.find('#build').find("option:selected").text(),
                    buildId:$p_id.find('#build').val(),
                    unitName: $p_id.find('#unit').find("option:selected").text(),
                    unitId:$p_id.find('#unit').val(),
                    doorplate:$p_id.find('#doorplate').val(),
                    userid:$p_id.find('#userid').val(),
                    username:$p_id.find('#username').val(),
                    assetid:$p_id.find('#assetid').val(),
                    waterid:$p_id.find('#waterid').val(),
                    watername:$p_id.find('#waterid').find("option:selected").text(),
                    type:$p_id.find('#type').val(),
                    typename:$p_id.find('#type').find("option:selected").text(),
                    batteryid:$p_id.find('#batteryid').val(),
                    batteryname:$p_id.find('#batteryid').find("option:selected").text(),
                    imp:$p_id.find('#imp').val(),
                    caliber:$p_id.find('#caliber').val(),
                    reading1:$p_id.find('#reading1').val(),
                    reading2:$p_id.find('#reading2').val(),
                    location:$('#sys_aname').val()+$p_id.find('#village').find("option:selected").text()+$p_id.find('#build').find("option:selected").text()+$p_id.find('#unit').find("option:selected").text()+$p_id.find('#doorplate').val()
                }
                $p_id.find("#addAreaModal").modal('hide');
                $("#popDiv").show();
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Watermeter_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {

                        if(data.statejson&&data.statejson.success){
                            into();
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("区域名称重复！");
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
    // 默认允许提交
    var holdSubmit = true;
    //添加和编辑窗口中的确认事件
    $p_id.find("#save_area").on("click", function () {
        if($p_id.find("#seq_no").val()&&$p_id.find("#seq_no").val()!=""){
            update();
        }else{
            add();
        }

    });
    //启用
/*    $p_id.find("#start_button").on("click",function () {
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            var  addlist = {
                seq_no: $p_id.find('#seq_no_edit').val(),
                p_id:sys_j_id,
                areaname:$p_id.find("#name_edit").val(),
                state:1,
            }
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Village_update_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    $p_id.find("#sureStart").modal('hide');
                    if(data.statejson&&data.statejson.success){
                        $('.tabReload').trigger("click");
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("启用失败！");
                        holdSubmit = true;
                    }
                },
                "error": function (data) {
                    $p_id.find("#sureStart").modal('hide');
                    holdSubmit = true;
                    Showbo.Msg.alert("系统错误！");
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
                seq_no: $p_id.find('#seq_no_edit').val(),
                p_id:sys_j_id,
                areaname:$p_id.find("#name_edit").val(),
                state:2,
            }
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Village_update_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    $p_id.find("#sureStop").modal('hide');
                    if(data.statejson&&data.statejson.success){
                        $('.tabReload').trigger("click");
                        holdSubmit = true;
                    }else{
                        Showbo.Msg.alert("停用失败！");
                        holdSubmit = true;
                    }
                },
                "error": function (data) {
                    $p_id.find("#sureStop").modal('hide');
                    holdSubmit = true;
                    Showbo.Msg.alert("系统错误！");
                    console.log(data);

                }
            });
        }
    });*/
    //删除
    $p_id.find("#del_button").on("click",function () {
        $p_id.find("#sureDel").modal('hide');
        if (holdSubmit) {
            // 只提交一次
            holdSubmit = false;
            var  addlist = {
                seqNo: $p_id.find('#seq_no_edit').val()
            }
            $p_id.find("#sureDel").modal('hide');
            $("#popDiv").show();
            $.ajax({
                "dataType": 'jsonp',
                "type": "get",
                "timeout": 20000,
                "async": false,
                "url": sys_client+'/JCSW/web/publicmenus/Watermeter_delete_edit.action',
                "data": addlist,
                "jsonp":"callback",
                "jsonpCaback":"handle",
                "success": function (data) {
                    if(data.statejson&&data.statejson.success){
                        Showbo.Msg.alert("删除成功！");
                        into();
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

});

