/**
 * 供应商查询
 */
$(function () {
    // 变量定义 START
    var $p_id = $("#commodity_manage_page");
    // 变量定义 END

    /**
     * 获取供应商信息
     */
    function init() {
        var params = {
            // 查询查询参数
            code: $p_id.find('#g_code').val(),    // 供应商编号
            name: $p_id.find('#g_name').val()     // 供应商名称
        };
        var table_src = $('#commodity_Table');    // 定义指向
        var ajax_url = '/base/product';               // 定义数据请求路径
        var pageSize = 10 ;                         // 定义每页长度默认为10
        var aoColumns = [
            {"col_id": "code"},                   // 供应商编号
            {"col_id": "name"},                   // 供应商名称
            {"col_id": "type"},                   // 供应商类型
            {"col_id": "lxr"},                    // 供应商联系人
            {"col_id": "mobile"}                  // 供应商联系方式
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
                return '<td><div class="text-center">'+data+'</div></td>';
            }
        },{
            "colIndex": 4,
            "html": function (data, type, full) {
                if (!data) {
                    return '';
                }
                return '<td><div class="text-center">'+data+'</div></td>';
            }
        }, {
            "colIndex": 5,
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

    // 查询表格数据
    init();

    /**
     * 获取到数据的回调函数，需要更该时可定义
     * @param data
     * @returns {*}
     */
    function fnChangeDataCallback(data){
        return data;
    }

    /**
     * 绘画完成之后的回调函数
     * @param data
     * @returns {*}
     */
    function fnDrawCallback(data){
        $p_id = $("#account_manage_page");
        return data;
    }
});
