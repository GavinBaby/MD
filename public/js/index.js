
$(function ($) {

    /********************************
     * 主导航菜单
     * 依赖jquery.ui.tab
     *******************************/
    var leftmenuWp = $('#navAside'),
        leftmenu = $('#j_menu')

    /********************************
     * 侧边导航菜单
     * 依赖jquery.ztree插件
     *******************************/
    var menu_setting = {
        view: {
            dblClickExpand: false,
            showLine: false,
            selectedMulti: false,
            showIcon: false,
            showTitle:false
        },
        data: {
            simpleData: {
                enable:true,
                idKey: "id",
                pIdKey: "pid",
                rootPId: ""
            }
        },
        callback: {
            onClick: function(event, treeId, treeNode){
                if(treeNode.link){
                    $.learuntab.addTab(treeNode.id,treeNode.link,treeNode.name);
                }

                leftmenu.find('li.active').removeClass('active');
                var _button = $('#'+treeNode.tId+'_switch');
                if(!_button.hasClass('noline_docu')){
                    var _menu = $.fn.zTree.getZTreeObj("j_menu");
                    _menu.expandNode(treeNode);
                }else{

                    $("#"+treeNode.tId).addClass('active');
                    /*addTab(treeNode.link, treeNode.name, '#'+treeNode.tId);*/
                }
            }
        }
    };
    $.fn.zTree.init(leftmenu, menu_setting, menu_data);


    $("#ul_top").find("li").on("click",function(){
        $("#ul_top").find("li").removeClass();
        $("#ul_top").find("li").addClass("li_top");
        $(this).addClass("li_top_a");

        var menu_data = [];
        var menu_list = menu_all;
        var num =0;
        var pid;
        debugger;
        for(var j=0;j<menu_list.length;j++){
            if($(this).attr("data-id")==menu_list[j].tree_id){
                if(menu_list[j].p_id==0){
                    menu_data.push({id: menu_list[j].seq_no, pid:menu_list[j].p_id, name: menu_list[j].name,open: true});
                }else if(menu_list[j].url){
                    menu_data.push({id: menu_list[j].seq_no, pid:menu_list[j].p_id, name: menu_list[j].name,link: menu_list[j].url});
                }else{
                    menu_data.push({id: menu_list[j].seq_no, pid:menu_list[j].p_id, name: menu_list[j].name});
                }

            }
        }
        /*if($(this).attr("data-id")==1){
            menu_data.push({id: 1, pid:0, name: "销售日报",open:true});
            menu_data.push({id: 12, pid:1, name: "销售日报管理",open:true});
            menu_data.push({id: 121, pid:12, name: "日报·查询",link: '/salesDaily_manage'});
            menu_data.push({id: 122, pid:12, name: "日报·新增",link: '/salesDaily_add'});
            menu_data.push({id: 13, pid:1, name: "审核销售日报"});
            menu_data.push({id: 131, pid:13, name: "日报·待审核",link: '/salesDaily_review1'});
            menu_data.push({id: 132, pid:13, name: "日报·已审核",link: '/salesDaily_review2'});
            menu_data.push({id: 133, pid:13, name: "日报·审核",link: '/salesDaily_add1'});


            menu_data.push({id: 2, pid:0, name: "促销活动"});
            menu_data.push({id: 21, pid:2, name: "促销活动管理"});
            menu_data.push({id: 211, pid:21, name: "活动·查询",link: '/activity_manage'});
            menu_data.push({id: 212, pid:21, name: "活动·新增",link: '/activity_add'});
            menu_data.push({id: 213, pid:21, name: "活动·待处理",link: '/activity_manage'});
            menu_data.push({id: 22, pid:2, name: "促销活动审核"});
            menu_data.push({id: 221, pid:22, name: "活动·待审核",link: '/activity_manage1'});
            menu_data.push({id: 222, pid:22, name: "活动·已审核",link: '/activity_manage2'});
        }else if($(this).attr("data-id")==2){
            menu_data.push({id: 31, pid:0, name: "供应商管理",open:true});
            menu_data.push({id: 311, pid:31, name: "供应商·查询",link: '/supplier_manage'});
            menu_data.push({id: 312, pid:31, name: "供应商·新增",link: '/supplier_add'});
            menu_data.push({id: 32, pid:0, name: "客户管理"});
            menu_data.push({id: 321, pid:32, name: "客户·查询",link: '/customer_manage'});
            menu_data.push({id: 322, pid:32, name: "客户·新增",link: '/customer_add'});
            menu_data.push({id: 33, pid:0, name: "商品管理"});
            menu_data.push({id: 331, pid:33, name: "商品·查询",link: '/commodity_manage'});
            menu_data.push({id: 332, pid:33, name: "商品·新增",link: '/commodity_add'});
        }else if($(this).attr("data-id")==3){
            menu_data.push({id: 41, pid:0, name: "入库单管理",open:true});
            menu_data.push({id: 411, pid:41, name: "入库单·填写",link:"/godownEntry_add"});
            menu_data.push({id: 412, pid:41, name: "入库单·确认",link:"/godownEntry_edit"});
            menu_data.push({id: 413, pid:41, name: "入库单·查询",link:"/godownEntry_manage"});
            menu_data.push({id: 42, pid:0, name: "发票管理"});
            menu_data.push({id: 421, pid:42, name: "采购发票·生成",link:"/godownInvoice_add"});
            menu_data.push({id: 422, pid:42, name: "采购发票·维护",link:"/godownInvoice_manage"});
            menu_data.push({id: 423, pid:42, name: "采购发票·查询",link:"/godownInvoice_manage1"});

            menu_data.push({id: 43, pid:0, name: "付款管理"});
            menu_data.push({id: 431, pid:43, name: "按发票付款",link:"/godownInvoice_pay"});
            menu_data.push({id: 432, pid:43, name: "按入库单付款",link:"/godownEntry_pay"});
        }else if($(this).attr("data-id")==4){
            menu_data.push({id: 51, pid:0, name: "出库单管理",open:true});
            menu_data.push({id: 511, pid:51, name: "出库单·填写",link:"/outbound_add"});
            menu_data.push({id: 512, pid:51, name: "出库单·查询",link:"/outbound_manage"});
            menu_data.push({id: 53, pid:0, name: "送货回单管理"});
            menu_data.push({id: 531, pid:53, name: "送货回单确认",link:"/receipt_confirm"});
            menu_data.push({id: 532, pid:53, name: "送货回单查询",link:"/receipt_manage"});
            menu_data.push({id: 54, pid:0, name: "调拨单管理"});
            menu_data.push({id: 541, pid:54, name: "调拨单·填写",link:"/allocation_add"});
            menu_data.push({id: 542, pid:54, name: "调拨单·查询",link:"/allocation_manage"});
        }else if($(this).attr("data-id")==9){
            menu_data.push({id: 61, pid:0, name: "用户管理",link:"/account_manage"});
            menu_data.push({id: 62, pid:0, name: "角色管理",link:"/role_manage"});
            menu_data.push({id: 63, pid:0, name: "基础项目管理",link:"/value_manage"});
        }else if($(this).attr("data-id")==5){
            menu_data.push({id: 72, pid:0, name: "发票管理",open:true});
            menu_data.push({id: 721, pid:72, name: "销售发票·生成",link:"/allocationInvoice_add"});
            menu_data.push({id: 722, pid:72, name: "销售发票·维护",link:"/allocationInvoice_manage"});
            menu_data.push({id: 723, pid:72, name: "销售发票·查询",link:"/allocationInvoice_manage1"});

            menu_data.push({id: 73, pid:0, name: "收款管理"});
            menu_data.push({id: 731, pid:73, name: "按发票收款",link:"/allocationInvoice_pay"});
            menu_data.push({id: 732, pid:73, name: "按出库单收款",link:"/allocationEntry_pay"});

            menu_data.push({id: 74, pid:0, name: "流水账",link:"/test_page"});
            menu_data.push({id: 75, pid:0, name: "财务商品明细账",link:"/test_page"});
        }else if($(this).attr("data-id")==6){
            menu_data.push({id: 83, pid:0, name: "客户售价管理",link: '/customerPrice_manage'});
            menu_data.push({id: 81, pid:0, name: "客户零星报价单",link: '/customerPrice_manage'});
            menu_data.push({id: 82, pid:0, name: "普通报价单"});
            menu_data.push({id: 85, pid:0, name: "商品进价管理"});
            menu_data.push({id: 86, pid:0, name: "单位进价管理"});
            menu_data.push({id: 87, pid:0, name: "进销价对照表"});
            menu_data.push({id: 88, pid:0, name: "进、批、零测算表"});
            menu_data.push({id: 89, pid:0, name: "优惠价设置"});
        }else if($(this).attr("data-id")==8){
            menu_data.push({id: 901, pid:0, name: "发票明细报表",link: '/allocationInvoice_report'});
            menu_data.push({id: 902, pid:0, name: "商品销售查询"});
            menu_data.push({id: 9021, pid:902, name: "商品销售统计表"});
            menu_data.push({id: 9022, pid:902, name: "商品销售统月度统计表"});
            menu_data.push({id: 9023, pid:902, name: "商品销售汇总表"});
            menu_data.push({id: 9024, pid:902, name: "按回单范围汇总"});
            menu_data.push({id: 9025, pid:902, name: "销售业绩"});
            menu_data.push({id: 903, pid:0, name: "单一品种按回单汇总表"});
            menu_data.push({id: 904, pid:0, name: "单一品种销售毛利"});
            menu_data.push({id: 905, pid:0, name: "人工销售汇总表"});
            menu_data.push({id: 906, pid:0, name: "应收帐统计"});
            menu_data.push({id: 907, pid:0, name: "应收账汇总表"});
            menu_data.push({id: 908, pid:0, name: "业务员缴款情况表"});
            menu_data.push({id: 909, pid:0, name: "业务员销售业绩报表"});
            menu_data.push({id: 911, pid:0, name: "客户分类汇总表"});
            menu_data.push({id: 912, pid:0, name: "客户差价结算报表"});
            menu_data.push({id: 913, pid:0, name: "商品销售情况统计"});
            menu_data.push({id: 914, pid:0, name: "库存数量金额报表"});
        }else if($(this).attr("data-id")==7){
            menu_data.push({id: 915, pid:0, name: "仓库入库",link:"/godownEntry_add"});
            menu_data.push({id: 916, pid:0, name: "订货单"});
            menu_data.push({id: 917, pid:0, name: "库存表"});
            menu_data.push({id: 918, pid:0, name: "仓库收发存报表"});
            menu_data.push({id: 919, pid:0, name: "客户退货报表"});
            menu_data.push({id: 920, pid:0, name: "供应商退货报表"});
            menu_data.push({id: 921, pid:0, name: "仓库装卸统计"});
            menu_data.push({id: 922, pid:0, name: "单一品种按出库单汇总"});
        }else if($(this).attr("data-id")==10){
            menu_data.push({id: 923, pid:0, name: "销售管理",open:true});
            menu_data.push({id: 9231, pid:923, name: "销售日报表"});
            menu_data.push({id: 9232, pid:923, name: "销售明细查询"});
            menu_data.push({id: 924, pid:0, name: "会员管理"});
            menu_data.push({id: 9241, pid:924, name: "会员登记"});
            menu_data.push({id: 9242, pid:924, name: "会员维护"});
            menu_data.push({id: 925, pid:0, name: "提货卷管理"});
            menu_data.push({id: 9251, pid:925, name: "提货卷设置"});
            menu_data.push({id: 9252, pid:925, name: "提货卷查询"})
            menu_data.push({id: 926, pid:0, name: "储酒管理"});
            menu_data.push({id: 9261, pid:926, name: "储酒登记"});
            menu_data.push({id: 9262, pid:926, name: "储酒明细查询"});

        }*/


        $.fn.zTree.init(leftmenu, menu_setting, menu_data);

    })




    $('.wmenu dl dt').click(function(){
        $('dd').each(function(){
            $(this).attr('class','hidden');
        });
        if($(this).hasClass('open')){
            $(this).removeClass("open");
            $(this).siblings('dd').attr('class','hidden');
        }else{
            $('dd').siblings().removeClass("open");
            $(this).addClass("open");
            $(this).closest('dl').find('dd').removeClass('hidden');

        }
    });

    setTimeout(function(){
        $("#popDiv").show();
        $.ajax({
            type:"get",
            url:"home",
            success:function(html){
                $("#popDiv").hide();
                $("#content-main").html(html);
            }
        })
    },100);



    $("#frist_show").on("click",function(){

        $("#popDiv").show();
        $.ajax({
            type:"get",
            url:"home",
            success:function(html){
                $("#popDiv").hide();
                $("#content-main").html(html);
            }
        })
        $('.menuTab').each(function () {
            $(this).removeClass('active');
        });
    })
    $.learuntab = {
        requestFullScreen: function () {
            var de = document.documentElement;
            if (de.requestFullscreen) {
                de.requestFullscreen();
            } else if (de.mozRequestFullScreen) {
                de.mozRequestFullScreen();
            } else if (de.webkitRequestFullScreen) {
                de.webkitRequestFullScreen();
            }
        },
        exitFullscreen: function () {
            var de = document;
            if (de.exitFullscreen) {
                de.exitFullscreen();
            } else if (de.mozCancelFullScreen) {
                de.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de.webkitCancelFullScreen();
            }
        },
        refreshTab: function () {
            var currentId = $('.page-tabs-content').find('.active').attr('data-id')||"home";
            $("#popDiv").show();
            $.ajax({
                type:"get",
                url:currentId,
                success:function(html){
                    $("#popDiv").hide();
                    $("#content-main").html(html);
                    $(".modal-backdrop").remove();
                }
            });

        },
        activeTab: function () {
            var currentId = $(this).data('id');
            $("#popDiv").show();
            $.ajax({
                type:"get",
                url:currentId,
                success:function(html){
                    $("#popDiv").hide();
                    $("#content-main").html(html);
                }
            })
            if (!$(this).hasClass('active')) {
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == currentId) {
                        $(this).show().siblings('.LRADMS_iframe').hide();
                        return false;
                    }
                });
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                $.learuntab.scrollToTab(this);
            }
        },
        closeOtherTabs: function () {
            $('.page-tabs-content').children("[data-id]").find('.fa-remove').parents('a').not(".active").each(function () {
                $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                $(this).remove();
            });
            $('.page-tabs-content').css("margin-left", "0");
        },
        closeTab: function () {
            var closeTabId = $(this).parents('.menuTab').data('id');
            var currentWidth = $(this).parents('.menuTab').width();
            if ($(this).parents('.menuTab').hasClass('active')) {
                if ($(this).parents('.menuTab').next('.menuTab').size()) {
                    var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                    $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');
                    $("#popDiv").show();
                    $.ajax({
                        type:"get",
                        url:activeId,
                        success:function(html){
                            $("#popDiv").hide();
                            $("#content-main").html(html);
                        }
                    })

                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                    if (marginLeftVal < 0) {
                        $('.page-tabs-content').animate({
                            marginLeft: (marginLeftVal + currentWidth) + 'px'
                        }, "fast");
                    }
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }else if ($(this).parents('.menuTab').prev('.menuTab').size()) {

                    var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                    $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                    $("#popDiv").show();
                    $.ajax({
                        type:"get",
                        url:activeId,
                        success:function(html){
                            $("#popDiv").hide();
                            $("#content-main").html(html);
                        }
                    })

                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == activeId) {
                            $(this).show().siblings('.LRADMS_iframe').hide();
                            return false;
                        }
                    });
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                }else{
                    $(this).parents('.menuTab').remove();
                    $('.mainContent .LRADMS_iframe').each(function () {
                        if ($(this).data('id') == closeTabId) {
                            $(this).remove();
                            return false;
                        }
                    });
                    $("#popDiv").show();
                    $.ajax({
                        type:"get",
                        url:"home",
                        success:function(html){
                            $("#popDiv").hide();
                            $("#content-main").html(html);
                        }
                    })
                }
            }
            else {
                $(this).parents('.menuTab').remove();
                $('.mainContent .LRADMS_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            return false;
        },
        addTab: function (data_id,href,text) {
            $(".navbar-custom-menu>ul>li.open").removeClass("open");
            var dataId = $(this).attr('data-id')||data_id;
            if (dataId != "") {
                //top.$.cookie('nfine_currentmoduleid', dataId, { path: "/" });
            }
            var dataUrl = $(this).attr('href')||href;
            var menuName = $.trim($(this).text()||text);
            var flag = true;
            if (dataUrl == undefined || $.trim(dataUrl).length == 0) {
                return false;
            }
            $('.menuTab').each(function () {
                if ($(this).data('id') == dataUrl||($(this).data('id').indexOf("/meter_reading?")>-1&dataUrl.indexOf("/meter_reading?")>-1)||($(this).data('id').indexOf("/console?")>-1&dataUrl.indexOf("/console?")>-1)) {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('active').siblings('.menuTab').removeClass('active');
                        $.learuntab.scrollToTab(this);
                        $('.mainContent .LRADMS_iframe').each(function () {
                            if ($(this).data('id') == dataUrl) {
                                $(this).show().siblings('.LRADMS_iframe').hide();
                                return false;
                            }
                        });
                    }
                    flag = false;
                    return false;
                }
            });
            if (flag) {
                var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-remove"></i></a>';
                $('.menuTab').removeClass('active');

                /*var str1 = '<iframe class="LRADMS_iframe" id="iframe' + dataId + '" name="iframe' + dataId + '"  width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
                $('.mainContent').find('iframe.LRADMS_iframe').hide();
                $('.mainContent').append(str1);*/

                //$.loading(true);
                $('.mainContent iframe:visible').load(function () {
                    //$.loading(false);
                });
                $('.menuTabs .page-tabs-content').append(str);
                $.learuntab.scrollToTab($('.menuTab.active'));
            }
            $("#popDiv").show();
            $.ajax({
                type:"get",
                url:dataUrl,
                success:function(html){
                    $("#popDiv").hide();
                    $("#content-main").html(html);
                }
            })
            return false;
        },
        scrollTabRight: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                if (scrollVal > 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: 0 - scrollVal + 'px'
                    }, "fast");
                }
            }
        },
        scrollTabLeft: function () {
            var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").width() < visibleWidth) {
                return false;
            } else {
                var tabElement = $(".menuTab:first");
                var offsetVal = 0;
                while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).next();
                }
                offsetVal = 0;
                if ($.learuntab.calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                    while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                        offsetVal += $(tabElement).outerWidth(true);
                        tabElement = $(tabElement).prev();
                    }
                    scrollVal = $.learuntab.calSumWidth($(tabElement).prevAll());
                }
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        scrollToTab: function (element) {
            var marginLeftVal = $.learuntab.calSumWidth($(element).prevAll()), marginRightVal = $.learuntab.calSumWidth($(element).nextAll());
            var tabOuterWidth = $.learuntab.calSumWidth($(".content-tabs").children().not(".menuTabs"));
            var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
            var scrollVal = 0;
            if ($(".page-tabs-content").outerWidth() < visibleWidth) {
                scrollVal = 0;
            } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
                if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                    scrollVal = marginLeftVal;
                    var tabElement = element;
                    while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                        scrollVal -= $(tabElement).prev().outerWidth();
                        tabElement = $(tabElement).prev();
                    }
                }
            } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
                scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
            }
            $('.page-tabs-content').animate({
                marginLeft: 0 - scrollVal + 'px'
            }, "fast");
        },
        calSumWidth: function (element) {
            var width = 0;
            $(element).each(function () {
                width += $(this).outerWidth(true);
            });
            return width;
        },
        init: function () {
            $('.menuItem').on('click', $.learuntab.addTab);
            $('.menuTabs').on('click', '.menuTab i', $.learuntab.closeTab);
            $('.menuTabs').on('click', '.menuTab', $.learuntab.activeTab);
            $('.tabLeft').on('click', $.learuntab.scrollTabLeft);
            $('.tabRight').on('click', $.learuntab.scrollTabRight);
            $('.tabReload').on('click', $.learuntab.refreshTab);
            $('.tabCloseCurrent').on('click', function () {
                $('.page-tabs-content').find('.active i').trigger("click");
            });
            $('.tabCloseAll').on('click', function () {
                $('.page-tabs-content').children("[data-id]").find('.fa-remove').each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').remove();
                    $(this).parents('a').remove();
                });
                $('.page-tabs-content').children("[data-id]:first").each(function () {
                    $('.LRADMS_iframe[data-id="' + $(this).data('id') + '"]').show();
                    $(this).addClass("active");
                });
                $('.page-tabs-content').css("margin-left", "0");
                $("#popDiv").show();
                $.ajax({
                    type:"get",
                    url:"home",
                    success:function(html){
                        $("#popDiv").hide();
                        $("#content-main").html(html);
                    }
                })

            });
            $('.tabCloseOther').on('click', $.learuntab.closeOtherTabs);
            $('.fullscreen').on('click', function () {
                if (!$(this).attr('fullscreen')) {
                    $(this).attr('fullscreen', 'true');
                    $.learuntab.requestFullScreen();
                } else {
                    $(this).removeAttr('fullscreen')
                    $.learuntab.exitFullscreen();
                }
            });
        }
    };
    $(window).load(function () {
        $('#ajax-loader').fadeOut();
    });
    $.learuntab.init();
})