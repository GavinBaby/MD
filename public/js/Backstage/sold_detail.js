/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#sold_detail_page");

    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });

    //日历控件
    //var nowTemp = new Date();
    //var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
    $p_id.find('.form_datetime').each(function (i, n) {
        var $date = $(n).find('.datepicker');

        var checkout = $date.eq(1).datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-TW',
            autoclose: true
        }).data('datetimepicker');

        var checkin = $date.eq(0).datetimepicker({
            format: 'yyyy-mm-dd hh:ii',
            language: 'zh-TW',
            autoclose: true
        }).on('changeDate', function (ev) {
            //if (ev.date.valueOf() > checkout.date.valueOf()) {
            var newDate = new Date(ev.date)
            newDate.setDate(newDate.getDate());
            debugger;
            checkout.setDate(newDate);
            checkout.setStartDate(newDate);
            //}
            $date.eq(1).focus();
        }).data('datetimepicker');
    });

    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Sellingarea_List_ajax.action',
        "data": {pid:sys_pId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#sid_q").empty();
            $p_id.find("#sid_q").append('<option value="">全部</option>');
            if(data&&data.rows.length>0){
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#sid_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
            }
        },
        "error": function (data) {
            $p_id.find("#addAreaModal").modal('hide');
            Showbo.Msg.alert("系统错误！");
            console.log(data);
            holdSubmit = true;
        }
    });

//查询（绘画表格）
    function into() {
        var num_size = 0;
        var params = { // 查询查询参数
            sid:$p_id.find("#sid_q").val(),//营业厅ID
            createUser:$p_id.find("#createUser_q").val(),//操作员
            str_time:$p_id.find("#str_time").val(),//起始时间
            end_time:$p_id.find("#end_time").val(),//截止时间
            company:sys_pId
        };

        var table_src = $p_id.find('#area_Table'); // 定义指向
        var ajax_url = '/solddetail/list'; // 定义数据请求路径 http://localhost:8080/JCSW/web/publicmenus/Area_List_ajax.action
        var pageSize = 10 ;// 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "sname"},
            {"col_id": "createUser"},
            {"col_id": "createTime"},
            {"col_id": "num"},
            {"col_id": "money"}
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
                return  '<td><div class="text-center" style="font-size: 14px;">'+data.substring(0,20)+'</div></td>';
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
        }]; // 定义需要改变的列

        // 列表为空时的数据
        var sZeroRecords = '<p class="text-gray-light ml-2 font-18">没有满足搜索条件的结果</p>';

        // 绘画表格
        TableAjax.drawTable(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, params, sZeroRecords, fnChangeDataCallback,fnDrawCallback);
    };
    //获取到数据的回调函数，需要更该时可定义
    function fnChangeDataCallback(data){
        $p_id = $("#sold_detail_page");
        return data;
    }
    //绘画完成之后的回调函数
    function fnDrawCallback(data){
        $p_id = $("#sold_detail_page");
        return data;
    }
//页面加载时自动调用查询的方法
   into();
//搜索后列表重构
    $p_id.find("#employeeSeatchBut").on("click", function () {
        into();
    });

});

