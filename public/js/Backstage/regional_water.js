/**
 * Created by Jacky on 2017/4/8.
 * 添加运动会页面js
 */

$(function () {
    var $p_id = $("#regional_water_page");
    var project_name = [];
    var project_no = [];
    var now = new Date();
    var year = now.getFullYear();
    $p_id.find("#year_q").val(year);
    //查询最新运动会

    // 柱状图数据
    project_name = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月', '十二月'];
    project_no = [1024, 1230, 987, 1680, 560, 0, 0, 0, 0, 0, 0, 0];
    function Canvas1() {
        var randomScalingFactor = function () {
            return Math.round(Math.random() * 100)
        };
        var chartData = {
            // x轴显示的label
            labels: project_name,
            datasets: [
                {
                    fillColor: '#578ebe',// 填充色
                    data: project_no, // 数据
                    label: '' // 图例
                }
            ]
        };
        // 柱状图选项设置
        var configs = {
            scaleOverlay: false,  // 网格线是否在数据线的上面
            scaleOverride: false, // 是否用硬编码重写y轴网格线
            scaleSteps: null, //y轴刻度的个数
            scaleStepWidth: null, //y轴每个刻度的宽度
            scaleStartValue: null,  //y轴的起始值
            scaleLineColor: "rgba(0,0,0,.1)",// x轴y轴的颜色
            scaleLineWidth: 1,// x轴y轴的线宽
            scaleShowLabels: true,// 是否显示y轴的标签
            scaleLabel: "<%=value%>",// 标签显示值
            scaleFontFamily: "'Arial'",// 标签的字体
            scaleFontSize: 12,// 标签字体的大小
            scaleFontStyle: "normal",// 标签字体的样式
            scaleFontColor: "#666",// 标签字体的颜色
            scaleShowGridLines: false,// 是否显示网格线
            scaleGridLineColor: "rgba(0,0,0,.05)",    // 网格线的颜色
            scaleGridLineWidth: 1, // 网格线的线宽
            scaleBeginAtZero: false, // y轴标记是否从0开始
            scaleShowHorizontalLines: true, // 是否显示横向线
            scaleShowVerticalLines: true, // 是否显示竖向线
            barShowStroke: true, // 是否显示线
            barStrokeWidth: 2,   // 线宽
            barValueSpacing: 5,// 柱状块与x值所形成的线之间的距离
            barDatasetSpacing: 1,// 在同一x值内的柱状块之间的间距
            animation: true,//是否有动画效果
            animationSteps: 60,//动画的步数
            animationEasing: "easeOutQuart",// 动画的效果
            showTooltips: false, // 是否显示提示
            // 图例
            legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
            // 动画完成后调用的函数(每个柱上显示对应的数据)
            onAnimationComplete: function () {
                var ctx = this.chart.ctx;
                ctx.font = this.scale.font;
                ctx.fillStyle = this.scale.textColor;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                this.datasets.forEach(function (dataset) {
                    dataset.bars.forEach(function (bar) {
                        ctx.fillText(bar.value, bar.x, bar.y);
                    });
                });
            }
        };

        // 开始绘制柱状图
        var ctx = document.getElementById("Canvas3").getContext('2d');
        var bar = new Chart(ctx).Bar(chartData, configs);
        var legend = document.getElementById('legend');
        // 图例
        legend.innerHTML = bar.generateLegend();


    }


    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Area_List_ajax.action',
        "data": {state:1,p_id:sys_pId,seq_no:sys_areaId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            $p_id.find("#area_q").empty();
            $p_id.find("#area_q").empty();
            if(data&&data.rows.length>0){
                $p_id.find("#area_q").append('<option value="">全部</option>');
                for(var i=0;i<data.rows.length;i++){
                    $p_id.find("#area_q").append('<option value="'+data.rows[i].seqNo+'">'+data.rows[i].name+'</option>');
                }
            }
        },
        "error": function (data) {
            $p_id.find("#addAreaModal").modal('hide');
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
            console.log(data);
            holdSubmit = true;
        }
    });


    function init(){
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Waterusage_mwater_ajax.action',
            "data": {company:sys_pId,areaId:$p_id.find("#area_q").val(),year:$p_id.find("#year_q").val()},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                project_name = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月', '十二月'];
                project_no = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        var xb = Number(data.rows[i].MONTH)-1
                        project_no[xb]=data.rows[i].TNUM
                    }
                }
                Canvas1();
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得各月份用水量！");
                console.log(data);
            }
        });
    }
    init()
    $p_id.find("#employeeSeatchBut").on("click",function() {
        init()
    });



});




