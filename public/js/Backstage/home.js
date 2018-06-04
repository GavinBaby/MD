/**
 * Created by Jacky on 2017/4/8.
 * 添加运动会页面js
 */

$(function () {
    var $p_id = $("#home_page");
    $p_id.find("#pName_title").html(sys_pname+(sys_areaName||"各区域")+"用水情况");
    $p_id.find("#area_show").html(sys_areaName||"");
    var sys_pId_ = sys_pId;
    if(sys_pId_=9999){
        sys_pId_=null;
    }
    $.ajax({
        "dataType": 'json',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": '/watermeter/list',
        "data": {company:sys_pId_,areaId:sys_areaId,recordStart:0,pageSize:1},
        "success": function (data) {
            if(data&&data.total>0){
                $p_id.find("#meter_totle").html(data.total);
            }
        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得区域数据失败！");
        }
    });

    $.ajax({
        "dataType": 'jsonp',
        "type": "get",
        "timeout": 20000,
        "async": false,
        "url": sys_client+'/JCSW/web/publicmenus/Abnormaldosage_Total_ajax.action',
        "data": {company:sys_pId_,areaId:sys_areaId},
        "jsonp":"callback",
        "jsonpCaback":"handle",
        "success": function (data) {
            if(data.total){
                $p_id.find("#water_consumption").html(data.total);
            }

        },
        "error": function (data) {
            Showbo.Msg.alert("系统错误，获得各月份用水量！");
            console.log(data);
        }
    });


    var project_name = [];
    var project_no = [];
    //查询最新运动会
    $(function () {
        Canvas1();
        Canvas3();
    });
    function Canvas1() {
        var randomScalingFactor = function () { return Math.round(Math.random() * 100) };
        var doughnutData = [];
        var color_list1=["#F7464A","#46BFBD","#FDB45C","#949FB1","#578ebe","#383838","#FFC0CB","#CDAD00","#D1D1D1","#BF3EFF","#00EE76","#EEEE00"];
        var color_list2=["#FF5A5E","#5AD3D1","#FFC870","#A8B3C5","#5CACEE","#4f5c65","#FFBBFF","#CDCD00","#D9D9D9","#B23AEE","#00FA9A","#FFFF00"];
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": '/area/list',
            "data": {state:1,p_id:sys_pId_},
            "success": function (data) {
                $p_id.find("#chart_title").empty();
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        var num =i%12;
                        doughnutData.push({
                            value: 0,
                            color: color_list1[num],
                            highlight: color_list2[num],
                            label: data.rows[i].name,
                            seq_no:data.rows[i].seqNo
                        })
                        $p_id.find("#chart_title").append('<div style="width: 25%;float: left;"><i class="fa fa-square" style="color: '+color_list1[num]+'; font-size: 18px; padding-right: 5px; vertical-align: middle; margin-top: -3px;"></i>'+data.rows[i].name+'</div>')
                    }
                }
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得区域数据失败！");
            }
        });
        $.ajax({
            "dataType": 'json',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": '/water/total',
            "data": {company:sys_pId_},//,areaId:sys_areaId
            "success": function (data) {
                var totle_=0;
                if(data&&data.rows.length>0){
                    for(var j=0;j<data.rows.length;j++){
                        totle_=totle_+data.rows[j].TNUM;
                        for(var i=0;i<doughnutData.length;i++){
                            if(doughnutData[i].seq_no==data.rows[j].AREA_ID){
                                doughnutData[i].value=data.rows[j].TNUM
                            }
                        }
                    }
                    $p_id.find("#water_totle").html(totle_);
                }
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获区总用水量失败！");
            }
        });



        var ctx = document.getElementById("Canvas1").getContext("2d");
        window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, { responsive: false });
    }
    function Canvas3() {
        var randomScalingFactor = function () { return Math.round(Math.random() * 100) };
        var date_now=new Date;
        var year_now=date_now.getFullYear();
        var monthr_now=date_now.getMonth()+1;
        $.ajax({
            "dataType": 'jsonp',
            "type": "get",
            "timeout": 20000,
            "async": false,
            "url": sys_client+'/JCSW/web/publicmenus/Waterusage_mwater_ajax.action',
            "data": {company:sys_pId_,areaId:sys_areaId,year:year_now},
            "jsonp":"callback",
            "jsonpCaback":"handle",
            "success": function (data) {
                project_name = ['一月份', '二月份', '三月份', '四月份', '五月份', '六月份', '七月份', '八月份', '九月份', '十月份', '十一月', '十二月'];
                project_no = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                if(data&&data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        if(monthr_now==Number(data.rows[i].MONTH)){
                            $p_id.find("#water_consumption").html(data.rows[i].TNUM);
                        }
                        var xb = Number(data.rows[i].MONTH)-1
                        project_no[xb]=data.rows[i].TNUM
                    }
                }
                var chartData = {
                    // x轴显示的label
                    labels:project_name,
                    datasets:[
                        {
                            fillColor:'#578ebe',// 填充色
                            data:project_no, // 数据
                            label:'' // 图例
                        }
                    ]
                };
                // 柱状图选项设置
                var configs  = {
                    scaleOverlay : false,  // 网格线是否在数据线的上面
                    scaleOverride : false, // 是否用硬编码重写y轴网格线
                    scaleSteps : null, //y轴刻度的个数
                    scaleStepWidth : null, //y轴每个刻度的宽度
                    scaleStartValue : null,  //y轴的起始值
                    scaleLineColor : "rgba(0,0,0,.1)",// x轴y轴的颜色
                    scaleLineWidth : 1,// x轴y轴的线宽
                    scaleShowLabels : true,// 是否显示y轴的标签
                    scaleLabel : "<%=value%>",// 标签显示值
                    scaleFontFamily : "'Arial'",// 标签的字体
                    scaleFontSize : 12,// 标签字体的大小
                    scaleFontStyle : "normal",// 标签字体的样式
                    scaleFontColor : "#666",// 标签字体的颜色
                    scaleShowGridLines : false,// 是否显示网格线
                    scaleGridLineColor : "rgba(0,0,0,.05)",    // 网格线的颜色
                    scaleGridLineWidth : 1, // 网格线的线宽
                    scaleBeginAtZero: false, // y轴标记是否从0开始
                    scaleShowHorizontalLines: true, // 是否显示横向线
                    scaleShowVerticalLines: true, // 是否显示竖向线
                    barShowStroke : true, // 是否显示线
                    barStrokeWidth : 2,   // 线宽
                    barValueSpacing : 5,// 柱状块与x值所形成的线之间的距离
                    barDatasetSpacing : 1,// 在同一x值内的柱状块之间的间距
                    animation : true,//是否有动画效果
                    animationSteps : 60,//动画的步数
                    animationEasing : "easeOutQuart",// 动画的效果
                    showTooltips: false, // 是否显示提示
                    // 图例
                    legendTemplate : '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
                    // 动画完成后调用的函数(每个柱上显示对应的数据)
                    onAnimationComplete: function () {
                        var ctx = this.chart.ctx;
                        ctx.font = this.scale.font;
                        ctx.fillStyle = this.scale.textColor;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        this.datasets.forEach(function (dataset){
                            dataset.bars.forEach(function (bar) {
                                ctx.fillText(bar.value, bar.x, bar.y);
                            });
                        });
                    }
                };
                // 开始绘制柱状图
                var ctx = document.getElementById('Canvas3').getContext('2d');
                var bar = new Chart(ctx).Bar(chartData, configs);
                var legend = document.getElementById('legend');
                // 图例
                legend.innerHTML = bar.generateLegend();
            },
            "error": function (data) {
                Showbo.Msg.alert("系统错误，获得各月份用水量！");
                console.log(data);
            }
        });
    }
});





