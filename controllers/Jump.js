var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('underscore');
var Promise = require("bluebird");
var knex = require('../lib/common/mysqlClient').knex;
var BusinessError = require('../lib/common/errors/businessError');
var util = require('../lib/util.js');
var session = require('express-session');
var filter = require('../lib/filter');
var filter_web = require('../lib/filter_web');
//var iconv = require('iconv-lite');

module.exports = function (app) {
    app.use('/', router);


    /*********************前端*********************/

    router.get('/',function (req, res) {
        res.redirect('/index')
    });
    // 默认filter.authorize,
    router.get('/login',function (req, res) {
        if(req.session.err){
            req.session.destroy();
            res.render('login',{code:1,text:"账户或密码错误"});
        }else{
            res.render('login',{code:0,text:""});
        }
    });
    //退出后台登录
    router.get('/logout', function (req, res) {
        req.session.destroy();
        res.render('login',{code:0,text:""});
    });

    //后台登录验证
    router.post('/login', function (req, res,next) {
        var userInfo =req.body;
        knex.select('*').from('account').where('username', userInfo.username).where('password', userInfo.password).where('state', 1).then(function (reply) {
            if(reply.length == 1){
                req.session.sys_userid = userInfo.username;
                req.session.sys_username = reply[0].name;
                req.session.role = reply[0].role;
                res.redirect('/index');
            }else{
                req.session.err = "账户或密码错误";
                res.redirect('/login');
            }
        }).catch(function (err) {
            next(err);
        });
    });

    //后台首页
    router.get('/index',filter_web.authorize, function (req, res) {
        var dayNames = new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
        var Stamp = new Date();
        var mm_dd = (Stamp.getMonth() + 1) +"月"+Stamp.getDate()+ "日";
        var Week = dayNames[Stamp.getDay()];
        res.render('index',{
            sys_userid:req.session.sys_userid,
            sys_username:req.session.sys_username,
            sys_roleId:req.session.role,
            sys_roleName:"超级管理员",
            mm_dd:mm_dd,
            Week:Week});
    });

    //首页
    router.get('/home',function (req, res) {
        res.render('Backstage/home',{code:0,text:""});
    });

    //销售日报新增
    router.get('/salesDaily_add',function (req, res) {
        res.render('Backstage/salesDaily_add',{code:0,text:""});
    });

    //销售日报审核页面
    router.get('/salesDaily_add1',function (req, res) {
        res.render('Backstage/salesDaily_add1',{code:0,text:""});
    });

    //销售日报待审核
    router.get('/salesDaily_review1',function (req, res) {
        res.render('Backstage/salesDaily_review1',{code:0,text:""});
    });

    //销售日报已审核
    router.get('/salesDaily_review2',function (req, res) {
        res.render('Backstage/salesDaily_review2',{code:0,text:""});
    });

    //销售日报维护
    router.get('/salesDaily_manage',function (req, res) {
        res.render('Backstage/salesDaily_manage',{code:0,text:""});
    });

    //活动管理
    router.get('/activity_manage',function (req, res) {
        res.render('Backstage/activity_manage',{code:0,text:""});
    });
    //活动管理
    router.get('/activity_manage1',function (req, res) {
        res.render('Backstage/activity_manage1',{code:0,text:""});
    });
    //活动管理
    router.get('/activity_manage2',function (req, res) {
        res.render('Backstage/activity_manage',{code:0,text:""});
    });

    //活动添加及详情
    router.get('/activity_add',function (req, res) {
        res.render('Backstage/activity_add',{code:0,text:""});
    });

    //供应商管理
    router.get('/supplier_manage',function (req, res) {
        res.render('Backstage/supplier_manage',{code:0,text:""});
    });

    //供应商添加及详情
    router.get('/supplier_add',function (req, res) {
        res.render('Backstage/supplier_add',{code:0,text:""});
    });

    //客户管理
    router.get('/customer_manage',function (req, res) {
        res.render('Backstage/customer_manage',{code:0,text:""});
    });

    //客户添加及详情
    router.get('/customer_add',function (req, res) {
        res.render('Backstage/customer_add',{code:0,text:""});
    });

    //商品管理
    router.get('/commodity_manage',function (req, res) {
        res.render('Backstage/commodity_manage',{code:0,text:""});
    });

    //商品添加及详情
    router.get('/commodity_add',function (req, res) {
        res.render('Backstage/commodity_add',{code:0,text:""});
    });

    //入库单填写
    router.get('/godownEntry_add',function (req, res) {
        res.render('Backstage/godownEntry_add',{code:0,text:""});
    });

    //入库单确认
    router.get('/godownEntry_edit',function (req, res) {
        res.render('Backstage/godownEntry_edit',{code:0,text:""});
    });

    //入库单查询
    router.get('/godownEntry_manage',function (req, res) {
        res.render('Backstage/godownEntry_manage',{code:0,text:""});
    });

    //进货发票生成
    router.get('/godownInvoice_add',function (req, res) {
        res.render('Backstage/godownInvoice_add',{code:0,text:""});
    });

    //进货发票维护
    router.get('/godownInvoice_manage',function (req, res) {
        res.render('Backstage/godownInvoice_manage',{code:0,text:""});
    });
    //进货发票维护
    router.get('/godownInvoice_manage1',function (req, res) {
        res.render('Backstage/godownInvoice_manage',{code:0,text:""});
    });

    //进货发票付款
    router.get('/godownInvoice_pay',function (req, res) {
        res.render('Backstage/godownInvoice_pay',{code:0,text:""});
    });

    //进货发票付款
    router.get('/godownEntry_pay',function (req, res) {
        res.render('Backstage/godownEntry_pay',{code:0,text:""});
    });

    //用户管理
    router.get('/account_manage',function (req, res) {
        res.render('Backstage/account_manage',{code:0,text:""});
    });

    //角色管理
    router.get('/role_manage',function (req, res) {
        res.render('Backstage/role_manage',{code:0,text:""});
    });

    //基础信息管理
    router.get('/value_manage',function (req, res) {
        res.render('Backstage/value_manage',{code:0,text:""});
    });



    //出库单填写
    router.get('/outbound_add',function (req, res) {
        res.render('Backstage/outbound_add',{code:0,text:""});
    });

    //出库单查询
    router.get('/outbound_manage',function (req, res) {
        res.render('Backstage/outbound_manage',{code:0,text:""});
    });

    //送货回单确认
    router.get('/receipt_confirm',function (req, res) {
        res.render('Backstage/receipt_confirm',{code:0,text:""});
    });

    //送货回单查询
    router.get('/receipt_manage',function (req, res) {
        res.render('Backstage/receipt_manage',{code:0,text:""});
    });

    //调拨单确认
    router.get('/allocation_add',function (req, res) {
        res.render('Backstage/allocation_add',{code:0,text:""});
    });

    //送货回单查询
    router.get('/allocation_manage',function (req, res) {
        res.render('Backstage/allocation_manage',{code:0,text:""});
    });

    //销售发票·生成
    router.get('/allocationInvoice_add',function (req, res) {
        res.render('Backstage/allocationInvoice_add',{code:0,text:""});
    });

    //销售发票·生成
    router.get('/allocationInvoice_manage',function (req, res) {
        res.render('Backstage/allocationInvoice_manage',{code:0,text:""});
    });

    //销售发票·生成
    router.get('/allocationInvoice_manage1',function (req, res) {
        res.render('Backstage/allocationInvoice_manage',{code:0,text:""});
    });

    //发票收款
    router.get('/allocationInvoice_pay',function (req, res) {
        res.render('Backstage/allocationInvoice_pay',{code:0,text:""});
    });

    //出库单收款
    router.get('/allocationEntry_pay',function (req, res) {
        res.render('Backstage/allocationEntry_pay',{code:0,text:""});
    });

    //待开发
    router.get('/test_page',function (req, res) {
        res.render('Backstage/test_page',{code:0,text:""});
    });

    //客户销售价管理
    router.get('/customerPrice_manage',function (req, res) {
        res.render('Backstage/customerPrice_manage',{code:0,text:""});
    });

    //发票明细查询
    router.get('/allocationInvoice_report',function (req, res) {
        res.render('Backstage/allocationInvoice_report',{code:0,text:""});
    });








};