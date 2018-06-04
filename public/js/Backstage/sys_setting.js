/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#sys_setting_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });

    $p_id.find('#mnum1').keyup(function() {
        if($(this).val()>$p_id.find('#mnum2').val()){
            $p_id.find('#mnum2').val($(this).val());
        }
        $p_id.find('#mnum1_show').val($(this).val());
    });
    $p_id.find('#mnum2').keyup(function() {

        $p_id.find('#mnum2_show').val($(this).val());
    });

    $p_id.find('#mnum2').blur(function() {
        if($(this).val()<$p_id.find('#mnum1').val()){
            $p_id.find('#mnum1').val($(this).val());
            $p_id.find('#mnum1_show').val($(this).val());
        }
    });

    $p_id.find('#ynum1').keyup(function() {
        if($(this).val()>$p_id.find('#ynum2').val()){
            $p_id.find('#ynum2').val($(this).val());
        }
        $p_id.find('#ynum1_show').val($(this).val());
    });
    $p_id.find('#ynum2').keyup(function() {

        $p_id.find('#ynum2_show').val($(this).val());
    });

    $p_id.find('#ynum2').blur(function() {
        if($(this).val()<$p_id.find('#ynum1').val()){
            $p_id.find('#ynum1').val($(this).val());
            $p_id.find('#ynum1_show').val($(this).val());
        }
    });


    $p_id.find('#ynum1').keyup(function() {
        $p_id.find('#ynum1_show').val($(this).val());
    });
    $p_id.find('#ynum2').keyup(function() {
        $p_id.find('#ynum2_show').val($(this).val());
    });

    $p_id.find('#cycle').keyup(function() {
        if($(this).val()>12){
            $(this).val(12);
        }
    });



    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Sysset_Info_ajax.action',
        "data": {company:sys_pId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            if(data&&data.rows.length>0){
                $p_id.find('#seq_no').val(data.rows[0].seqNo);
                $p_id.find('#cycle').val(data.rows[0].cycle);
                $p_id.find('#mnum1').val(data.rows[0].mnum1);
                $p_id.find('#mnum2').val(data.rows[0].mnum2);
                $p_id.find('#mnum1_show').val(data.rows[0].mnum1);
                $p_id.find('#mnum2_show').val(data.rows[0].mnum2);
                $p_id.find('#mpercent1').val(data.rows[0].mpercent1);
                $p_id.find('#mpercent2').val(data.rows[0].mpercent2);
                $p_id.find('#ynum1').val(data.rows[0].ynum1);
                $p_id.find('#ynum2').val(data.rows[0].ynum2);
                $p_id.find('#ynum1_show').val(data.rows[0].ynum1);
                $p_id.find('#ynum2_show').val(data.rows[0].ynum2);
                $p_id.find('#ypercent1').val(data.rows[0].ypercent1);
                $p_id.find('#ypercent2').val(data.rows[0].ypercent2);
            }

        },
        "error": function (data) {
            $p_id.find("#addAreaModal").modal('hide');
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
            console.log(data);
            holdSubmit = true;
        }
    });

    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/account/list',
        "data": {seqNo:sys_userid},
        "success": function (data) {

            if(data&&data.rows.length>0){
                $p_id.find('#username').val(data.rows[0].username);
                $p_id.find('#password').val(data.rows[0].password);
                $p_id.find('#companyname').val(data.rows[0].pName);
            }
        },
        "error": function (data) {
            $p_id.find("#addAccountModel").modal('hide');
            holdSubmit = true;
            Showbo.Msg.alert("系统错误！");
            console.log(data);

        }
    });


    // 默认允许提交
    var holdSubmit = true;
    //添加和编辑窗口中的确认事件
    $p_id.find("#updata_user").on("click", function () {
        if ($p_id.find('#update_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    seqNo:sys_userid,
                    username: $p_id.find('#username').val(),
                    password: $p_id.find('#password').val(),
                    p_name:$p_id.find('#companyname').val()
                }
                $("#popDiv").show();
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Acctest_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        $("#popDiv").hide();
                        if(data.statejson&&data.statejson.success){
                            sys_username= $p_id.find('#username').val();
                            Showbo.Msg.alert("更新成功！");
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("名称重复！");
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("更新失败！");
                            holdSubmit = true;
                        }
                    },
                    "error": function (data) {
                        $("#popDiv").hide();
                        holdSubmit = true;
                        Showbo.Msg.alert("系统错误！");
                        console.log(data);

                    }
                });
            }
        }
    });
    //新建
    function add(){
        if ($p_id.find('#add_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var  addlist = {
                    company:sys_pId,
                    cycle:$p_id.find("#cycle").val(),
                    mnum1:$p_id.find("#mnum1").val(),
                    mnum2:$p_id.find("#mnum2").val(),
                    mpercent1:$p_id.find("#mpercent1").val(),
                    mpercent2:$p_id.find("#mpercent2").val(),
                    ynum1:$p_id.find("#ynum1").val(),
                    ynum2:$p_id.find("#ynum2").val(),
                    ypercent1:$p_id.find("#ypercent1").val(),
                    ypercent2:$p_id.find("#ypercent2").val(),
                    createuser:"123"
                }
                $("#popDiv").show();
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Sysset_add_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        if(data.statejson&&data.statejson.success){
                            $("#popDiv").hide();
                            Showbo.Msg.alert("保存成功！");
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("区域名称重复！");
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("保存失败！");
                            holdSubmit = true;
                        }
                    },
                    "error": function (data) {
                        $("#popDiv").hide();
                        Showbo.Msg.alert("系统错误！");
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
                    company:sys_pId,
                    cycle:$p_id.find("#cycle").val(),
                    mnum1:$p_id.find("#mnum1").val(),
                    mnum2:$p_id.find("#mnum2").val(),
                    mpercent1:$p_id.find("#mpercent1").val(),
                    mpercent2:$p_id.find("#mpercent2").val(),
                    ynum1:$p_id.find("#ynum1").val(),
                    ynum2:$p_id.find("#ynum2").val(),
                    ypercent1:$p_id.find("#ypercent1").val(),
                    ypercent2:$p_id.find("#ypercent2").val()
                }
                $("#popDiv").show();
                $.ajax({
                    "dataType": 'jsonp',
                    "type": "get",
                    "timeout": 20000,
                    "async": false,
                    "url": sys_client+'/JCSW/web/publicmenus/Sysset_update_edit.action',
                    "data": addlist,
                    "jsonp":"callback",
                    "jsonpCaback":"handle",
                    "success": function (data) {
                        $("#popDiv").hide();
                        if(data.statejson&&data.statejson.success){
                            Showbo.Msg.alert("更新成功！");
                            holdSubmit = true;
                        }else if(data.statejson&&data.statejson.errCode==2){
                            Showbo.Msg.alert("名称重复！");
                            holdSubmit = true;
                        }else{
                            Showbo.Msg.alert("更新失败！");
                            holdSubmit = true;
                        }
                    },
                    "error": function (data) {
                        $("#popDiv").hide();
                        holdSubmit = true;
                        Showbo.Msg.alert("系统错误！");
                        console.log(data);

                    }
                });
            }
        }
    }
    // 默认允许提交
    var holdSubmit = true;
    //添加和编辑窗口中的确认事件
    $p_id.find("#save_btn").on("click", function () {
        if($p_id.find("#seq_no").val()&&$p_id.find("#seq_no").val()!=""){
            update();
        }else{
            add();
        }

    });

});

