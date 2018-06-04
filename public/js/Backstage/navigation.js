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
    var $p_id = $("#navigation_page");





    function init() {
        var params = { // 查询查询参数
            name: $p_id.find('#name_q').val(), // 名字
            sort: $p_id.find('#sort_q').val(), // 帐号
            href: $p_id.find('#href_q').val(), // 角色
            status: $p_id.find('#status_q').val(), // 状态
        };

        var table_src = $('#account_Table'); // 定义指向
        var ajax_url = '/navigation/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "sort"},
            {"col_id": "name"},
            {"col_id": "href"},
            {"col_id": "status"}
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
                return '<td><div class="text-center">'+data+'</div></td>';
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

                    return '<td><div class="text-center">删除</div></td>';
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
        //定义new_account_id为最新唯一ID
        if(data.data.length>0){
            if(!new_account_id){
                new_account_id = data.data[data.data.length-1].seq_no+1;
            }
        }else{
            new_account_id = 10000;
        }


        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        return data;
    }

    //添加用户弹窗
    $('#addStaffModal').on('click', function () {
        document.getElementById("add_account_form").reset();
        $("#seq_no_show").val(new_account_id);
        $('#addAccountModal').modal('show');
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
                    sort:$("#sort").val(),
                    name:$("#name").val(),
                    href:$("#href").val()
                };
                //新建
                if($('#seq_no').val() == 0){
                    $.ajax({
                        "dataType": 'json',
                        "type": "get",
                        "timeout": 20000,
                        "url": '/navigation/new',
                        "data": {params:params},
                        "success": function (data) {
                            window.location.reload();
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }else{   //更新
                    params.seq_no = $('#seq_no').val();
                    $.ajax({
                        "dataType": 'json',
                        "type": "get",
                        "timeout": 20000,
                        "url": '/navigation/new',
                        "data": {params:params},
                        "success": function (data) {
                            window.location.reload();
                        },
                        "error": function (data) {
                            console.log(data);
                        }
                    });
                }

            }
        }
    });


    // 动态绑定删除事件
    $(document).on("click", ".employee_del", function () {
        $('#seq_no').val($(this).attr('data-id'));
        // 显示成功对话框
        $("#sureDel").modal('show');
        //if(confirm("确认要删除该员工信息吗？")){
        //    fnemployeePage.delEmployee($(this));
        //}
    });
    // 动态绑定恢复事件
    $(document).on("click", ".employee_re", function () {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/navigation/recovery?seq_no=' + $(this).attr('data-id'),
            "data": {},
            "success": function (data) {
                window.location.reload();
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });
    // 确认删除
    $("#confirmDialog").click(function () {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/navigation/del?seq_no=' + $('#seq_no').val(),
            "data": {},
            "success": function (data) {
                window.location.reload();
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });
    // 动态绑定编辑事件
    $(document).on("click", ".employee_edit", function () {
        $('#seq_no').val($(this).attr('data-id'));
        //请求数据自动填充
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/navigation/list?seq_no=' + $('#seq_no').val(),
            "data": {},
            "success": function (data) {
                $("#sort").val(data.data[0].sort);
                $("#seq_no_show").val(data.data[0].seq_no);
                $("#name").val(data.data[0].name);
                $("#href").val(data.data[0].href);
            },
            "error": function (data) {
                console.log(data);
            }
        });
        // 显示成功对话框
        $('#addAccountModal').modal('show');
    });

    // 动态绑定重置密码事件
    $(document).on("click", ".employee_resetpass", function () {
        $('#seq_no').val($(this).attr('data-id'));
        // 显示成功对话框
        $("#sureReset").modal('show');
    });
    // 确认修改密码
    $("#resetPassword").click(function () {
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "url": '/navigation/resetPassword?seq_no=' + $('#seq_no').val(),
            "data": {},
            "success": function (data) {
                window.location.reload();
            },
            "error": function (data) {
                console.log(data);
            }
        });
    });

});





