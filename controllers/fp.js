var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('underscore');
var Promise = require("bluebird");
var knex = require('../lib/common/mysqlClient').knex;
var bookshelf = require('../lib/common/mysqlClient').bookshelf;
var BusinessError = require('../lib/common/errors/businessError');
var util = require('../lib/util.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var filter = require('../lib/filter');
var t_buy_invoice = require('../models/table').t_buy_invoice;
var t_buy_invoice_detail = require('../models/table').t_buy_invoice_detail;
var t_buy_pay = require('../models/table').t_buy_pay;

module.exports = function (app) {
    app.use('/buy', router);


    /*********************发票填写*********************/
//{"main":{"code":1},"detail":[{"pro_id":111},{"pro_id":222}]}
    router.post('/fp',function (req, res) {
        var main = req.body.main;
        var detail = req.body.detail;
        //发票编号,供应商id, 供应商名称,应付款金额，扣款,发票金额,,发票日期, 入库单（逗号分隔） ,是否未结账
        main= _.pick(main,'code','supplier_id','supplier_name','total','reduce','fp_je','fp_date','remark','bills' ,'is_part','create_man','create_time');
        main.create_time = moment(main.create_time).format('YYYY-MM-DD HH:mm:ss');
        main.isdeleted = 0;
        bookshelf.transaction(function (t) {
            return knex.max('id as id').from('t_buy_invoice').then(function (data) {
                main.id = (data[0].id || 0) + 1;
                detail.forEach(function (e,i) {
                    //产品id,name,收货单号， 本次开票数量，金额
                    detail[i] = _.pick(detail[i], 'pro_id', 'pro_name', 'billno', 'num', 'amount','is_part');
                    detail[i].main_id = main.id;
                });
                return t_buy_invoice.query().insert(main);
            }).then(function (data) {
                return t_buy_invoice_detail.query().insert(detail);
            }).then(function (data) {
                res.send({code: 1});
            })
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });

    router.get('/fp',function (req, res) {
        var cond =_.pick(req.body.data,'code', 'supplier_id','fp_date');
        t_buy_invoice.query().where('isdeleted',0).andWhere(cond).then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });


    /*********************付款*********************/
//{"main":{"pay_date":"2017-08-10","pay_man":"test1","pay_total":"1001","pay_no":"201","remark":"赵dd"} }
    router.post('/pay',function (req, res) {
        var main = req.body.main;
        //付款日期,付款人, 付款金额,付款编号，备注,入库单号，发票号，付款类型,,付款标志, 供应商，制单人，制单时间，预付款，记录单号，销账人，销账日期
        main= _.pick(main,'pay_date','pay_man','pay_total','pay_no','remark','bill_no','invoice_no','pay_type','pay_flag',
            'supplier_id','supplier_code' ,'supplier_name','create_man','create_time','pre_pay','record_no','cancal_man','cancal_date');
        main.create_time = moment(main.create_time).format('YYYY-MM-DD HH:mm:ss');
        main.isdeleted = 0;
        t_buy_pay.query().insert(main) .then(function (data) {
                res.send({code: 1});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });

};