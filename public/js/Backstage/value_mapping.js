/**
 * Created by admin on 2015/3/24.
 * 员工管理页面js
 */

$(function () {
    var num1;
    var new_num;
    var $p_id = $("#value_mapping_page");

    //数据表格筛选处事件冒泡
    $('.j_bubble').click(function (event) {
        event.stopPropagation();
    });

    // 阻止回车触发表格填充事件
    $('.j_bubble').keypress(function (e) {
        e.stopPropagation();
    });

    function init() {
        var params = { // 查询查询参数
            code: $p_id.find('#seq_q').val(), // 排序
            pid: $p_id.find('#type_like').val(), // 关键字
            dicname: $p_id.find('#key_name').val() // 名字
        };
        var table_src = $('#account_Table'); // 定义指向
        var ajax_url = '/value_mapping/list'; // 定义数据请求路径
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "code"},
            {"col_id": "pid"},
            {"col_id": "dicname"},
            {"col_id": "remark"},
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
        },{
            "colIndex": 4,
            "html": function (data, type, full) {
                var retHtml = '';
                if (full.id) {
                    retHtml = retHtml + '<div class="drop-opt">' +
                        '<a href="javascript:;" id="dropLabel-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">操作列表<span class="icon-chevron-down"></span></a>' +
                        '<ul class="drop-cnt in" role="menu" aria-labelledby="dropLabel-1">' +
                        '<li><a class="employee_edit" href="javascript:void(0)" data-id="'+full.id+'" data-toggle="modal">编辑</a></li>' +
                        '<li><a class="employee_del" href="javascript:void(0)" data-id="'+full.id+'" data-toggle="modal">删除</a></li>' +
                        '</ul>' +
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
    //搜索后列表重构
    $p_id.find("#mapSeatchBut").on('click',function(){
        init();
    });
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        var $p_id = $("#value_mapping_page");
        // 动态绑定编辑事件
        $p_id.find(".employee_edit").on("click",function () {
            num1 = $(this).attr('data-id');
            $p_id.find("#account_id").val(num1);
            //查询详情 并自动填充
            $.ajax({
                type: "get",
                url: "/value_mapping/get?num1="+num1,
                dataType: "json",
                data: {},
                success: function (data) {
                    $p_id.find("#code").val(data[0].code);
                    $p_id.find("#pid").val(data[0].pid);
                    $p_id.find("#dicname").val(data[0].dicname);
                    $p_id.find("#remark").val(data[0].remark);
                },
                error: function (data) {
                    alert("系统错误");
                }
            });
            //填充标题
            $p_id.find("#areaLab").html('编辑字典');
            // 显示成功对话框
            $p_id.find("#addMapModal").modal('show');
        });
        //删除
        $p_id.find(".employee_del").on("click",function () {
            num1 = $(this).attr('data-id');
            $p_id.find("#delMapModal").modal('show');
        });
        return data;
    }
    init();

    $p_id.find('#del_map').on('click', function () {
        $.ajax({
            type: "post",
            url: '/value_mapping/del?num1='+num1,
            dataType: "json",
            data:{},
            success: function (data) {
                alert("删除成功！");
                $('.tabReload').trigger("click");
            },
            error: function (data) {
                alert("系统错误");
                $('.tabReload').trigger("click");s
            }
        })
    });
    //添加字典弹窗
    $p_id.find('#addmap').on('click', function () {
        $p_id.find("#keyLab").val("");
        $p_id.find("#nameLab").val("");
        $p_id.find("#account_id").val("");
        $p_id.find("#areaLab").html('添加字典');
        $p_id.find('#addMapModal').modal('show');

    });

    $p_id.find('#save_map').on('click', function () {



        var data = {
            code:$p_id.find("#code").val(),
            pid:$p_id.find("#pid").val(),
            dicname:$p_id.find("#dicname").val(),
            diccode:0,
            remark:$p_id.find("#remark").val()
        };
        if(!data.code){
            alert("排序不能为空！")
        }
        if(!data.pid){
            alert("关键字不能为空！")
        }
        if(!data.dicname){
            alert("名称不能为空！")
        }
        if(num1){
            data.id=num1;
            var url= "/value_mapping/update"
        }else{
            var url= "/value_mapping/insert"
        }

        $.ajax({
            type: "post",
            url: url,
            dataType: "json",
            data: data,
            success: function (data) {
                if(data&&data.state){
                    alert("保存成功！");
                    $('.tabReload').trigger("click");
                }else{
                    alert("关键字不可重复！");
                    $('.tabReload').trigger("click");
                }


            },
            error: function (data) {
                alert("系统错误");
                $('.tabReload').trigger("click");
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





