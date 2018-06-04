var TableMap = []; // 用于存放生成的table
var TableParamsMap = []; // 用于存放table参数
var TableAjax = {
    /***
     * @param table_src table对象 jquery对象
     * @param ajax_url  请求数据url
     * @param pageSize  每页显示长度，默认为10
     * @param aoColumns 定义列id
     * @param aoColumnDefs 需要更改的列
     * @param in_params 自定义参数
     * @param sZeroRecords 没有数据时的显示内容
     * @param fnChangeDataCallback  获取到数据的回调函数，需要更该时可定义
     * @param fnDrawCallback 绘画完成之后的回调函数
     */
    drawTable: function (table_src, ajax_url, pageSize, aoColumns, aoColumnDefs, in_params, sZeroRecords, fnChangeDataCallback, fnDrawCallback) {
        $("#popDiv").show();
        var t_id = table_src.attr("id");
        if (!TableParamsMap[t_id]) {
            TableParamsMap[t_id] = {
                fnDrawCallback: fnDrawCallback || function (table_src) {
                }, // 绘画结束的回调函数
                fnChangeDataCallback: fnChangeDataCallback || function (data) {
                    return data;
                } // 自定义返回参数
            };
        }
        // 构造参数
        var params = BuildTable.buildTableParams(table_src, ajax_url, pageSize, aoColumns, aoColumnDefs);
        // 参数赋值给全局变量
        TableParamsMap[t_id].ajax_params = in_params;
        // 点击第二次按钮会触发
        if (TableMap[t_id]) {
            // 判断table下是否存在空数据时的html,不存在任何数据则认为是
            // html页面要求，tbody中初始化不存在任何tr元素
            if (table_src.find("tbody tr").length > 0) {
                TableMap[t_id].fnDraw();
                return false;
            }
        }
        //创建数据表格
        TableMap[t_id] = params.table_src.dataTable({
            bInfo: false, // 是否显示表格相关信息
            bFilter: false, // 是否使用客户端过滤
            bJQueryUI: false, // 不使用本身样式
            bSort: true, // 是否按列排序
            bLengthChange: false, // 是否可以改变表格长度
            sAjaxSource: params.ajax_url, // 请求路径
            bServerSide: true, // 开启每次对表格的操作都是请求后台
            bProcessing: false, // 显示等待
            iDisplayLength: params.pageSize, // 设置每页显示条数
            fnDestroy: true, // 是否允许销毁
            sPaginationType: "full_numbers", // 是否显示全部页码
            bStateSave: false, // 是否记录查询状态信息
            bRetrieve: true, // 是否允许返回table
            aaSorting: [[0, 'asc']], // 默认初始化的排序方式 第一列 倒序
            fnDrawCallback: function () {
                TableParamsMap[t_id].fnDrawCallback(params.table_src);
            },
            oLanguage: {
                sProcessing: "正在加载中......",
                sZeroRecords: sZeroRecords ? sZeroRecords : "表中无数据存在！",
                sEmptyTable: sZeroRecords ? sZeroRecords : "表中无数据存在！",
                sFilter: false,
                oPaginate: {
                    sFirst: '首页',
                    sPrevious: '<span class="icon-caret-left"></span>上一页',
                    sNext: '下一页<span class="icon-caret-right"></span>',
                    sLast: '尾页'
                }
            },
            aoColumns: params.aoColumns,
            aoColumnDefs: params.aoColumnDefs,
            fnServerData: function (sSource, aoData, fnCallback, oSettings) {
                var a_params = BuildTable.buildAjaxParams(aoData, TableParamsMap[t_id].ajax_params, t_id);
                if (TableParamsMap[t_id].ajax_params.sortName) {
                    a_params.sortName = TableParamsMap[t_id].ajax_params.sortName;
                }
                if (TableParamsMap[t_id].ajax_params.sortType) {
                    a_params.sortType = TableParamsMap[t_id].ajax_params.sortType;
                }

                //驼峰转连字符
                if(a_params.sortName){
                    a_params.sortName = a_params.sortName.replace(/([A-Z])/g,"_$1").toLowerCase();
                }
                $.ajax({
                    "dataType": 'json',
                    "type": "get",
                    "timeout": 20000,
                    "url": sSource,
                    "data": a_params,
                    "success": function (res) {
                        $("#popDiv").hide();
                        // 返回参数规范化 同api
                        var data = {
                            "draw": TableParamsMap[t_id].sEcho, // 请求次数
                            "recordsTotal": res.totalSize ? res.totalSize : 0, // 总条数
                            "recordsFiltered": res.totalSize ? res.totalSize : 0, // 过滤之后的总条数
                            "data": res.data ? res.data : []// 数据
                        }
                        var s_num = a_params.recordStart
                        for(var i=0;i<data.data.length;i++){
                            s_num++
                            data.data[i].s_num = s_num
                        }
                        /*if(a_params.sortType=="desc"){
                            var s_num = a_params.recordStart+data.data.length
                            for(var i=0;i<data.data.length;i++){
                                data.data[i].s_num = s_num
                                s_num--
                            }
                        }else{
                            var s_num = a_params.recordStart
                            for(var i=0;i<data.data.length;i++){
                                s_num++
                                data.data[i].s_num = s_num
                            }
                        }*/

                        fnCallback(TableParamsMap[t_id].fnChangeDataCallback(data));
                    }
                });
            }
        });
    }
};


var BuildTable = {
    /**
     * 构造table表格参数  (参数名称或者什么需要改正时修改此处)
     * table_src 要填充的table对象 string
     * ajax_url 请求数据的url string
     * pageSize 每页的长度 默认为10 int
     * aoColumns 定义列的id  api修改时修改此处即可  规则 Array [{"col_id":"字段id"，"sortEnable":"此列是否允许排序 默认为true 允许 false 不允许"}]
     * aoColumnDefs 定义需要修改的列 Array 规则 [{"colIndex":"需要改变的列的索引","html":"需要转换的html"}]
     */
    buildTableParams: function (table_src, ajax_url, pageSize, aoColumns, aoColumnDefs) {
        var out_table_src = table_src;
        var out_ajax_url = ajax_url;
        var out_pageSize = pageSize ? pageSize : 10;
        var out_aoColumns = [];
        var out_aoColumnDefs = [];
        // 构造表格列id
        if (aoColumns) {
            // 转换列id 同api
            for (var i = 0; i < aoColumns.length; i++) {
                var Column = {};
                Column.mData = aoColumns[i].col_id;
                Column.bSortable = true;
                if (false == aoColumns[i].sortEnable) {
                    Column.bSortable = false;
                }
                out_aoColumns.push(Column);
            }
        }
        // 转换需要转换的列
        if (aoColumnDefs) {
            // 转换列id 同api
            for (var i = 0; i < aoColumnDefs.length; i++) {
                var ColuMnDef = {};
                ColuMnDef.targets = aoColumnDefs[i].colIndex;
                ColuMnDef.mRender = aoColumnDefs[i].html;
                out_aoColumnDefs.push(ColuMnDef);
            }
        }
        return {
            table_src: out_table_src, // 定义指向 object
            ajax_url: out_ajax_url, // 定义数据请求路径 string
            pageSize: out_pageSize, // 定义每页长度默认为10 int
            aoColumns: out_aoColumns, // 定义表格数据列id Array 如 {"mData": "aa2",bSortable:false}, mData 对应返回的key bSortable 是否允许此列排序
            aoColumnDefs: out_aoColumnDefs // 定义需要改变的列 Array
        }
    },
    /***
     * 定义请求参数
     * @param aoData
     * @return sEcho 请求次数 p_start 起始位置 p_length长度 p_sortName 排序的列的name p_sort 排序的列的方式
     * 固定的排序方式和排序字段可在请求参数中加入 sortName: 排序字段 sortType : 排序方法字段
     */
    buildAjaxParams: function (aoData, in_params, t_id) {
        // 自定义参数
        // 浅度copy参数 ， 直接赋值对象会认为是同一个元素
        var str_params = in_params ? JSON.stringify(in_params) : {};

        var out_params = JSON.parse(str_params);
        var JsonaoData = JSON.parse(JSON.stringify(aoData));
        for (var i = 0; i < JsonaoData.length; i++) {
            if (JsonaoData[i].name == 'sEcho') { // 请求次数
                out_params.sEcho = JsonaoData[i].value;
                TableParamsMap[t_id].sEcho = JsonaoData[i].value;
            } else if (JsonaoData[i].name == 'iDisplayStart') { // 起始位置
                out_params.recordStart = JsonaoData[i].value;
            } else if (JsonaoData[i].name == 'iDisplayLength') { // 长度
                out_params.pageSize = JsonaoData[i].value;
            }
            if (JsonaoData[i].name == 'iSortCol_0') { // 排序字段;
                var sortIndex = JsonaoData[i].value * 2;
                out_params.sortName = JsonaoData[5 + sortIndex].value;
            }
            if (JsonaoData[i].name == 'sSortDir_0') { // 排序方法
                out_params.sortType = JsonaoData[i].value;
            }
        }
        return out_params;
    }
}