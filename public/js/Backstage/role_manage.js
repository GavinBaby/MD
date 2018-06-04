/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    var seq_no;
    var new_seq_no;
    var $p_id = $("#role_manage_page");

    //数据表格筛选处事件冒泡
    $('.j_bubble').click(function (event) {
        event.stopPropagation();
    });

    // 阻止回车触发表格填充事件
    $('.j_bubble').keypress(function (e) {
        e.stopPropagation();
    });

    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        var $p_id = $("#role_manage_page");
        // 动态绑定编辑事件
        $p_id.find(".employee_edit").on("click", function () {
            seq_no = $(this).attr('data-id');
            //查询详情 并自动填充
            $.ajax({
                type: "get",
                url: "/role_info/get?seq_no="+seq_no,
                dataType: "json",
                data: {},
                success: function (data) {

                    $p_id.find("#role_id").val(data[0].seq_no);
                    $p_id.find("#role_name").val(data[0].role_name);
                    $p_id.find("input[name='menu_id']").each(function(){
                        $(this).attr("checked",false);
                        if(data[0].menu_id.indexOf($(this).attr("data-value")) >= 0){
                            $(this).attr("checked",true);
                        }
                    })
                },
                error: function (data) {
                    Showbo.Msg.alert("系统错误");
                }
            });
            // 显示成功对话框
            $p_id.find("#addAccountModal").modal('show');
        });
        //删除角色弹窗
        $p_id.find(".employee_del").on("click", function () {
            $p_id.find("#del_id").val($(this).attr("data-id"));
            $p_id.find('#delAccountModal').modal('show');
        });
        //启用角色弹窗
        $p_id.find(".employee_enable").on("click",function () {
            $p_id.find("#enable_id").val($(this).attr("data-id"));
            $p_id.find('#enableAccountModal').modal('show');
        });
        return data;
    }
    function init() {
        var params = { // 查询查询参数
            seq_no: $p_id.find('#seq_q').val(), // 编号
            role_name: $p_id.find('#name_n').val(), // 员工工号
            date1s: $p_id.find('#search_s').val(), // 员工工号
            date1e: $p_id.find('#search_e').val(), // 员工工号
            date2s: $p_id.find('#new_s').val(), // 员工工号
            date2e: $p_id.find('#new_e').val(), // 员工工号
            status: $p_id.find('#status_q').val(), // 员工工号
        };

        var table_src = $p_id.find('#role_Table'); // 定义指向
        var ajax_url = '/role_info/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "seq_no"},
            {"col_id": "role_name"},
            {"col_id": "date1"},
            {"col_id": "date2"},
            {"col_id": "status"},
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
                return '<td><div class="text-center">' + data + '</div></td>';
            }
        }, {
            "colIndex": 3,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return '<td><div class="text-center">' + data + '</div></td>';
            }
        }, {
            "colIndex": 4,
            "html": function (data, type, full) {
                if(data == 1){
                    return '<td><div class="text-center">正常</div></td>';
                }else{
                    return '<td><div class="text-center">停用</div></td>';
                }
            }
        }, {
            "colIndex": 5,
            "html": function (data, type, full) {
                var retHtml = '';
                var li_div = '';
                if(full.seq_no==1||full.seq_no==2||full.seq_no==3){
                    li_div = '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>'
                }else if(full.status==1){
                    li_div = '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>' +
                             '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">停用</a></li>';
                }else if(full.status==2){
                    li_div = '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">编辑</a></li>' +
                        '<li><a class="employee_enable" href="javascript:void(0)" data-id="'+full.seq_no+'" data-toggle="modal">启用</a></li>';
                }
                retHtml = retHtml + '<div class="drop-opt">' +
                    '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                    '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +li_div+
                    '</ul>' +
                    '</div>';
                return retHtml;
            }

        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';
        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //搜索后列表重构
    $p_id.find("#employeeSeatchBut").on('click',function(){
        init();
    });
    init();






    //添加角色弹窗
    $('#addStaffModal').on('click', function () {
        $p_id.find("input[name='res']").click();
        $p_id.find("input[name='menu_id']").each(function(){
            $(this).attr("checked",false);
        })
        $p_id.find('#addAccountModal').modal('show');
    });



    //启用
    $p_id.find('#enable_role').on('click', function () {
        $.ajax({
            type: "post",
            url: '/role_info/update',
            dataType: "json",
            data:{status:1,seq_no:$p_id.find("#enable_id").val()},
            success: function (data) {
                $('.tabReload').trigger("click");
            },
            error: function (data) {
                Showbo.Msg.alert("系统错误");
            }
        })
    });
    //删除
    $p_id.find('#del_role').on('click', function () {
        $.ajax({
            type: "post",
            url: '/role_info/del?seq_no='+$p_id.find("#del_id").val(),
            dataType: "json",
            data:{},
            success: function (data) {
                $('.tabReload').trigger("click");
            },
            error: function (data) {
                Showbo.Msg.alert("系统错误");
            }
        })
    });


    //删除
    $p_id.find('#del_role').on('click', function () {
        $.ajax({
            type: "post",
            url: '/role_info/del?seq_no='+$p_id.find("#del_id").val(),
            dataType: "json",
            data:{},
            success: function (data) {
                $('.tabReload').trigger("click");
            },
            error: function (data) {
                Showbo.Msg.alert("系统错误");
            }
        })
    });


    $p_id.find('#save_role').on('click', function () {
        var menu_id="";
        $p_id.find("input[name='menu_id']").each(function(){
            if($(this).is(':checked')){
                menu_id+=$(this).attr("data-value")+",";
            }
        })


        menu_id = menu_id.substring(0,menu_id.length-1);
        var data = {
            menu_id:menu_id,
            role_name:$p_id.find("#role_name").val(),
            status:1,
        };
        if($p_id.find("#role_id").val()){
            data.seq_no =  $p_id.find("#role_id").val();
        }


        $.ajax({
            type: "post",
            url: '/role_info/update',
            dataType: "json",
            data: data,
            success: function (data) {
                $('.tabReload').trigger("click");
            },
            error: function (data) {
                Showbo.Msg.alert("系统错误");
            }
        })

    });
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
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


})





