/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function () {
    //页面id
    var $p_id = $("#console_page");
    //弹出框居中
    $('.modal').on('show.bs.modal', function () {
        $(this).addClass('modal-outer');
    }).on('hidden.bs.modal', function () {
        $(this).removeClass('modal-outer');
    });
//查询（绘画表格）
    function into_record() {
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Collectorrecord_ReordList_ajax.action',
            "data": {seqNolist:seqNolist,sortName:"CREATE_TIME",sortType:"asc"},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                $p_id.find("#tbody_html").empty();
                debugger;
                if(data&&data.rows.length>0){
                    if(data.total==0){
                        window.clearInterval(initrecord);
                    }
                    for(var i=0;i<data.rows.length;i++){
                        var html_td ='';
                        if(data.rows[i].state==1){
                            html_td='<td> <div class="text-center" style="font-size: 14px;color: #0092db;">抄表执行中</div> </td> ';
                        }else if(data.rows[i].state==2){
                            html_td='<td> <div class="text-center" style="font-size: 14px;color: green;">抄表成功</div> </td> ';
                        }else{
                            html_td='<td> <div class="text-center" style="font-size: 14px;color: red;">抄表失败</div> </td> ';
                        }
                        $p_id.find("#tbody_html").append('<tr>' +
                            '<td><div class="text-center" style="font-size: 14px;">'+data.rows[i].name+'</div></td> ' +
                            '<td> <div class="text-center" style="font-size: 14px;">'+data.rows[i].id+'</div> </td> ' +
                            '<td> <div class="text-center" style="font-size: 14px;">'+data.rows[i].villageName+'</div> </td> ' +html_td +
                            '<td> <div class="text-center" style="font-size: 14px;"><a class="details"  href="javascript:void(0)" data-id="'+data.rows[i].seqNo+'">详情</a></div></td> ' +
                            '</tr>');
                    }
                    $p_id.find(".details").on("click", function () {
                        $.learuntab.addTab("2063","/reading_record?id="+$(this).attr("data-id"),"抄表记录");
                    });
                }
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得数据失败！");
            }
        });
    };
    into_record();
    initrecord =window.setInterval(into_record,10000);

});

