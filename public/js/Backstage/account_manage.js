/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    //数据表格筛选处事件冒泡
    $('.j_bubble').click(function (event) {
        event.stopPropagation();
    });

    // 阻止回车触发表格填充事件
    $('.j_bubble').keypress(function (e) {
        e.stopPropagation();
    });
    var tempObj;
    var tempEmpObj;
    var new_account_id;//新数据的编号（最大+1)
    var classOption = '';
    var $p_id = $("#account_manage_page");
    var roles =[];
    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/role/list',
        "data": {status:1},
        "success": function (data) {
            roles =data.data;
            $p_id.find("#part_q").empty();
            $p_id.find("#part").empty();
            $p_id.find("#part_q").append('<option value="">全部</option>');
            if(roles&&roles.length>0){
                for(var i=0;i<roles.length;i++){
                    $p_id.find("#part_q").append('<option value="'+roles[i].seq_no+'">'+roles[i].name+'</option>');
                    $p_id.find("#part").append('<option value="'+roles[i].seq_no+'">'+roles[i].name+'</option>');

                }
            }
        },
        "error": function (data) {
            console.log(data);
        }
    });




    function init() {
        var params = { // 查询查询参数
            role: $p_id.find('#part_q').val(), // 角色
            state: $p_id.find('#status_q').val() // 状态
        };
        if($p_id.find('#seach_id').val()=="seq_no"){
            params.seq_no = $p_id.find('#seach_val').val()
        }else if($p_id.find('#seach_id').val()=="name"){
            params.name = $p_id.find('#seach_val').val()
        }
        var table_src = $('#account_Table'); // 定义指向
        var ajax_url = '/account/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "seq_no"},
            {"col_id": "name"},
            {"col_id": "role"},
            {"col_id": "state"}
        ]; // 定义表格数据列id
        var aoColumnDefs = [{
            "colIndex": 0,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return '<td><div class="text-center">' + data + '</div></td>';
            }
        }, {
            "colIndex": 1,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return '<td><div class="text-center">' + data + '</div></td>';
            }
        }, {
            "colIndex": 2,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                for(var i=0;i<roles.length;i++){
                    if(data == roles[i].seq_no){
                        return '<td><div class="text-center">'+roles[i].name+'</div></td>';
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
                    return '<td><div class="text-center">正常</div></td>';
                }else if(data == 2){

                    return '<td><div class="text-center">停用</div></td>';
                }
                /*for (var i = 0; i < fnemployeePage.stautss.length; i++) {
                 if (fnemployeePage.stautss[i].key_id == data) {
                 text = fnemployeePage.stautss[i].key_val_cn;
                 }
                 }*/
            }
        }, {
            "colIndex": 4,
            "html": function (data, type, full) {
                var retHtml = '';
                if (full.name == 'admin') {
                    retHtml = retHtml + '<div class="drop-opt">' +
                        '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">详情<span class="icon-chevron-down"></span></a>' +
                        '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                        '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>';
                    retHtml +='</ul>' +
                        '</div>';
                } else {
                    retHtml = retHtml + '<div class="drop-opt">' +
                        '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">详情<span class="icon-chevron-down"></span></a>' +
                        '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                        '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>';
                    if(full.state == 1){
                        retHtml += '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">停用</a></li>';
                    }else{
                        retHtml += '<li><a class="employee_re" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">恢复</a></li>'
                    }
                    retHtml +='</ul>' +
                        '</div>';

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
    $("#employeeSeatchBut").on('click',function(){
        init();
    });

    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        $p_id = $("#account_manage_page");
        // 动态绑定编辑事件
        $p_id.find(".employee_edit").on("click", function () {
            $p_id.find('#seq_no').val($(this).attr('data-id'));

            //请求数据自动填充
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "timeout": 20000,
                "url": '/account/list?seq_no=' + $('#seq_no').val(),
                "data": {},
                "success": function (data) {
                    $("#part").val(data.data[0].role);
                    $("#account_id").val(data.data[0].seq_no);
                    $("#name").val(data.data[0].name);
                    $("#password").val(data.data[0].password);
                },
                "error": function (data) {
                    console.log(data);
                }
            });
            // 显示成功对话框
            $('#addAccountModal').modal('show');
        });

        // 动态绑定删除事件
        $p_id.find(".employee_del").on("click",function () {
            $p_id.find('#seq_no').val($(this).attr('data-id'));
            // 显示成功对话框
            $("#sureDel").modal('show');
        });
        // 动态绑定恢复事件
        $p_id.find(".employee_re").on("click", function () {
            $.ajax({
                "dataType": 'json',
                "type": "get",
                "timeout": 20000,
                "url": '/account/recovery',
                "data": {seq_no:$(this).attr('data-id')},
                "success": function (data) {
                    $('.tabReload').trigger("click");
                },
                "error": function (data) {
                    console.log(data);
                }
            });
        });
        return data;
    }

    //添加用户弹窗
    $('#addStaffModal').on('click', function () {
        document.getElementById("add_account_form").reset();
        $("#account_id").val(new_account_id);
        $('#addAccountModal').modal('show');
//        $('#sureReset').modal('show');
    });

    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });


    //确认添加按钮
    $('#save_account').on('click', function () {
        // 默认允许提交
        var holdSubmit = true;
        if ($('#add_account_form').isValid()) {
            if (holdSubmit) {
                // 只提交一次
                holdSubmit = false;
                var params = {
                    role:$("#part").val(),
                    username:$("#username").val(),
                    name:$("#name").val(),
                    password:$("#password").val()
                };
                //新建
                if(!$('#seq_no').val()){
                    params.state = 1;
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "timeout": 20000,
                        "url": '/account/new',
                        "data": params,
                        "success": function (data) {
                            // 弹出添加成功信息
                            $('#addAccountModal').modal('hide');
                            $('#sureReset').modal('show');
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }else{   //更新
                    params.seq_no = $('#seq_no').val();
                    $.ajax({
                        "dataType": 'json',
                        "type": "post",
                        "timeout": 20000,
                        "url": '/account/new',
                        "data": params,
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

    // 信息添加成功
    $("#resetPassword").click(function () {
        $('.tabReload').trigger("click");
    });

    // 确认删除
    $("#confirmDialog").click(function () {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/account/del',
            "data": {seq_no:$p_id.find('#seq_no').val()},
            "success": function (data) {
                $('.tabReload').trigger("click");
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });



});
