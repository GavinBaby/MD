/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    var $p_id = $("#IC_card_page");
    //数据表格筛选处事件冒泡
    $('.j_bubble').click(function (event) {
        event.stopPropagation();
    });

    // 阻止回车触发表格填充事件
    $('.j_bubble').keypress(function (e) {
        e.stopPropagation();
    });

    //日历控件
    //var nowTemp = new Date();
    //var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    $('.form_datetime').each(function (i, n) {
        var $date = $(n).find('.datepicker');

        var checkout = $date.eq(1).datetimepicker({
            minView: "month",
            format: 'yyyy-mm-dd ',
            language: 'zh-TW',
            autoclose: true
        }).data('datetimepicker');

        var checkin = $date.eq(0).datetimepicker({
            minView: "month",
            format: 'yyyy-mm-dd ',
            language: 'zh-TW',
            autoclose: true
        }).on('changeDate', function (ev) {
            //if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate());
            checkout.setDate(newDate);
            checkout.setStartDate(newDate);
            //}
            $date.eq(1).focus();
        }).data('datetimepicker');
    });

    var tempObj;
    var tempEmpObj;
    var new_account_id;//新数据的编号（最大+1)
    var classOption = '';

    var roles =[];
    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/role_info/list',
        "data": {status:1},
        "success": function (data) {
            roles =data.data;
            if(roles&&roles.length>0){
                for(var i=0;i<roles.length;i++){
                    $p_id.find("#part_q").append('<option value="'+roles[i].seq_no+'">'+roles[i].role_name+'</option>');
                    $p_id.find("#part").append('<option value="'+roles[i].seq_no+'">'+roles[i].role_name+'</option>');
                }
            }
        },
        "error": function (data) {
            console.log(data);
        }
    });

    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/value_mapping/list',
        "data": {type:"年级"},
        "success": function (data) {
            if(data&&data.data.length>0){
                for(var i=0;i<data.data.length;i++){
                    $p_id.find("#class").append('<option value="'+data.data[i].key_id+'">'+data.data[i].key_val_cn+'</option>');
                }
            }
        },
        "error": function (data) {
            console.log(data);
        }
    });




    function init() {
        var num_true = true;
        var params = { // 查询查询参数
            name: $p_id.find('#name_q').val(), // 名字
            account_id: $p_id.find('#account_id_q').val(), // 帐号
            part: $p_id.find('#part_q').val(), // 角色
            status: $p_id.find('#status_q').val(), // 状态
        };

        var table_src = $p_id.find('#account_Table'); // 定义指向
        var ajax_url = '/account/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "account_id"},
            {"col_id": "name"},
            {"col_id": "part"},
            {"col_id": "status"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                if(num_true){
                    return '<td><div class="text-center " style="font-size: 14px;">' + data + '</div></td>';
                }else{
                    return '<td><div class="text-center gray" style="font-size: 14px;">' + data + '</div></td>';
                }

            }
        }, {
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                if(num_true){
                    return '<td><div class="text-center">' + data + '</div></td>';
                }else{
                    return '<td><div class="text-center gray">' + data + '</div></td>';
                }

            }
        }, {
            "colIndex": 2,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                for(var i=0;i<roles.length;i++){
                    if(data == roles[i].seq_no){
                        if(num_true){
                            return '<td><div class="text-center">'+roles[i].role_name+'</div></td>';
                        }else{
                            return '<td><div class="text-center gray">'+roles[i].role_name+'</div></td>';
                        }

                    }
                }
            }
        },{
            "colIndex": 3,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                var text = '';
                if(data == 1){
                    if(num_true){
                        return '<td><div class="text-center">正常</div></td>';
                    }else{
                        return '<td><div class="text-center gray">正常</div></td>';
                    }

                }else if(data == 2){
                    if(num_true){
                        return '<td><div class="text-center">删除</div></td>';
                    }else{
                        return '<td><div class="text-center gray">删除</div></td>';
                    }
                }
                /*for (var i = 0; i < fnemployeePage.stautss.length; i++) {
                 if (fnemployeePage.stautss[i].key_id == data) {
                 text = fnemployeePage.stautss[i].key_val_cn;
                 }
                 }*/
            }
        }, {
            "colIndex":4,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                if(num_true){
                    return '<td><div class="text-center">' + data + '</div></td>';
                }else{
                    return '<td><div class="text-center gray">' + data + '</div></td>';
                }

            }
        },{
            "colIndex":5,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                if(num_true){
                    return '<td><div class="text-center">' + data + '</div></td>';
                }else{
                    return '<td><div class="text-center gray">' + data + '</div></td>';
                }

            }
        },{
            "colIndex":6,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                if(num_true){
                    return '<td><div class="text-center">' + data + '</div></td>';
                }else{
                    return '<td><div class="text-center gray">' + data + '</div></td>';
                }

            }
        }, {
            "colIndex": 7,
            "html": function (data, type, full) {
                var retHtml = '';
                if(num_true){
                    num_true = false;
                    if (full.seq_no == 10000) {
                        retHtml = retHtml + '<div class="drop-opt">' +
                            '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                            '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                            '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>'+
                            '</ul>' +
                            '</div>';
                    } else {

                        retHtml = retHtml + '<div class="drop-opt">' +
                            '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                            '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                            '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>';
                        if(full.status == 1){
                            retHtml += '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">删除</a></li>';
                        }else{
                            retHtml += '<li><a class="employee_re" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">恢复</a></li>'
                        }
                        retHtml +='</ul>' +
                            '</div>';

                    }
                }else{
                    num_true = true;
                    if (full.seq_no == 10000) {
                        retHtml = retHtml + '<div class="drop-opt gray">' +
                            '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                            '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                            '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>'+
                            '</ul>' +
                            '</div>';
                    } else {
                        retHtml = retHtml + '<div class="drop-opt gray">' +
                            '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                            '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                            '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>';
                        if(full.status == 1){
                            retHtml += '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">删除</a></li>';
                        }else{
                            retHtml += '<li><a class="employee_re" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">恢复</a></li>'
                        }
                        retHtml +='</ul>' +
                            '</div>';

                    }
                }

                return retHtml;
            }
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';
        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };


    init();

    //搜索后列表重构
    $p_id.find("#employeeSeatchBut").on('click',function(){
        init();
    });

    var size_num
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        //定义new_account_id为最新唯一ID
        size_num = data.data.length;
        if(!new_account_id){
            new_account_id = data.data[data.data.length-1].seq_no+1;
            new_account_id = 'P'+new_account_id
        }

        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        $p_id = $("#IC_card_page");
        // 动态绑定删除事件
        $p_id.find(".employee_del").on("click",function () {
            $('#seq_no').val($(this).attr('data-id'));
            // 显示成功对话框
            $("#sureDel").modal('show');
            //if(confirm("确认要删除该员工信息吗？")){
            //    fnemployeePage.delEmployee($(this));
            //}
        });
        // 动态绑定恢复事件
        $p_id.find(".employee_re").on("click", function () {
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "timeout": 20000,
                "url": '/account/recovery?seq_no=' + $(this).attr('data-id'),
                "data": {},
                "success": function (data) {
                    $('.tabReload').trigger("click");
                },
                "error": function (data) {
                    console.log(data);
                }
            });
        });
        // 动态绑定编辑事件
        $p_id.find('.employee_edit').on("click",function () {
            $p_id.find('#seq_no').val($(this).attr('data-id'));
            //请求数据自动填充
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "timeout": 20000,
                "url": '/account/list?seq_no=' + $p_id.find('#seq_no').val(),
                "data": {},
                "success": function (data) {
                    $p_id.find("#part").val(data.data[0].part);
                    if(data.data[0].part_name=="老师"){
                        $p_id.find('#class_div').attr("style","");
                        $p_id.find("#class").val(data.data[0].class);
                    }else{
                        $p_id.find('#class_div').attr("style","display: none");
                    }
                    $p_id.find("#account_id").val(data.data[0].account_id);
                    $p_id.find("#name").val(data.data[0].name);
                    $p_id.find("#password").val(data.data[0].password);
                },
                "error": function (data) {
                    console.log(data);
                }
            });
            // 显示成功对话框
            $p_id.find('#addAccountModal').modal('show');
        });
        //var html = ""
        //for(var i=0;i<Math.ceil(size_num/10);i++){
        //    html += '<option>'+(i+1)+'</option>';
        //}
        //$p_id.find("#account_Table_paginate").append('<select style="width: 66px;border: 1px solid #dbe0e4;border-radius: 3px；float: left;height: 24px;margin-left: 5px;">'+html+'</select>');
        return data;
    }

    //添加用户弹窗
    $p_id.find('#addStaffModal').on('click', function () {
        /*return false;*/
        /*$p_id.find("#add_account_form").reset();*/
        $p_id.find("input[name='res']").click();
        $p_id.find("#account_id").val(new_account_id);
        $p_id.find('#class_div').attr("style","display: none");
        $p_id.find('#addAccountModal').modal('show');
    });

    //弹出框居中
    $p_id.find('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });


    //确认添加按钮
    $p_id.find('#save_account').on('click', function () {
        // 默认允许提交
        var holdSubmit = true;
        if ($p_id.find('#add_account_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var params = {
                    part:$p_id.find("#part").val(),
                    part_name:$p_id.find("#part").find("option:selected").text(),
                    account_id:$p_id.find("#account_id").val(),
                    name:$p_id.find("#name").val(),
                    password:$p_id.find("#password").val(),
                    class:$p_id.find("#class").val()
                };
                //新建
                if($p_id.find('#seq_no').val() == 0){

                    params.status = 1;
                    params.regTime = new Date();
                    $.ajax({
                        "dataType": 'json',
                        "type": "get",
                        "timeout": 20000,
                        "url": '/account/new',
                        "data": {params:params},
                        "success": function (data) {
                            $('.tabReload').trigger("click");
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }else{   //更新
                    params.seq_no = $p_id.find('#seq_no').val();
                    $.ajax({
                        "dataType": 'json',
                        "type": "get",
                        "timeout": 20000,
                        "url": '/account/new',
                        "data": {params:params},
                        "success": function (data) {
                            $('.tabReload').trigger("click");
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }

            }
        }
    });



    // 确认删除
    $p_id.find("#confirmDialog").click(function () {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/account/del?seq_no=' + $p_id.find('#seq_no').val(),
            "data": {},
            "success": function (data) {
                $('.tabReload').trigger("click");
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });

    $p_id.find("#part").on("change", function () {
        if($(this).find("option:selected").text()=="老师"){
            $p_id.find('#class_div').attr("style","");
        }else{
            $p_id.find('#class_div').attr("style","display: none");
        }
    })


});





