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
var t_buy_inbill = require('../models/table').t_buy_inbill;
var t_buy_inbill_detail = require('../models/table').t_buy_inbill_detail;
var t_buy_invoice = require('../models/table').t_buy_invoice;
var t_buy_invoice_detail = require('../models/table').t_buy_invoice_detail;
var t_buy_pay = require('../models/table').t_buy_pay;

module.exports = function (app) {
    app.use('/buy', router);


    /*********************入库单填写*********************/
//{"main":{"hd_code":1},"detail":[{"pro_id":111},{"pro_id":222}]}
    router.post('/inbill',function (req, res) {
        var info = JSON.parse(req.body.jsonSting);
        var main = info.main;
        var detail = info.detail;
        //货单号码，应收款记录号,入库记录单号,收货单号,入库时间,供应商id, 供应商名称,仓库id, 仓库code,仓库name,发票号码，发票日期， 制单人,制单时间
        main= _.pick(main,'hd_code','ysk_code','in_code','get_code','in_time','supplier_id','supplier_name','ck_id','ck_code','ck_name','fp_code','fp_time','create_man','create_time');
        main.create_time = moment(main.create_time).format('YYYY-MM-DD HH:mm:ss');
        main.isdeleted = 0;
        bookshelf.transaction(function (t) {
            return knex.max('id as id').from('t_buy_inbill').then(function (data) {
                main.id = (data[0].id || 0) + 1;
                detail.forEach(function (e,i) {
                    //产品id,name,条形码，规格，整数，零数，数量，税率，税率,不含税价,不含税金额,含税单价,含税金额,备注，库存,是否计入退换卡
                    detail[i] = _.pick(detail[i], 'pro_id', 'pro_name', 'barcode', 'gg', 'zs', 'num', 'rate', 'bhsj', 'bhsje', 'hsdj', 'hsje', 'remark', 'kc', 'is_back');
                    detail[i].main_id = main.id;
                });
                return t_buy_inbill.query().insert(main).transacting(t);
            }).then(function (data) {
                return t_buy_inbill_detail.query().insert(detail).transacting(t);
            }).then(function (data) {
                res.send({code: 1});
            })
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });


    /*********************入库单确认*********************/
    // {"data":{"id":[2,3],"get_code":"123123","in_time":"2018-01-01"} }
    router.post('/inbill/confirm',function (req, res) {
        var data =_.pick(req.body.data,'get_code','in_time');
        var ids= _.pick(req.body.data,'id').id;

        bookshelf.transaction(function (t) {
            return  knex('t_buy_inbill_detail').where('main_id','in',ids).then(function (returns) {
                return Promise.map(returns, function (yi) {
                    // 先查库存表里是否有记录
                    //return  knex('t_b_product_ck').where('ck_id', yi.ck_id).andWhere('supplier_id', yi.supplier_id).andWhere('p_id', yi.pro_id).then(function (back) {
                    //    if(back.length>0){
                    //        if(yi.is_back){
                    //            return knex('t_b_product_ck').where('ck_id', yi.ck_id).andWhere('supplier_id', yi.supplier_id).andWhere('p_id', yi.pro_id).increment('back_num', yi.num).transacting(t);
                    //        }else{
                    //            return knex('t_b_product_ck').where('ck_id', yi.ck_id).andWhere('supplier_id', yi.supplier_id).andWhere('p_id', yi.pro_id).increment('num', yi.num).transacting(t);
                    //        }
                    //    }else{
                            var ck = {};
                            ck.p_id  = yi.pro_id;
                            ck.p_name  = yi.pro_name;
                            ck.ck_id = yi.ck_id;
                            ck.supplier_id = yi.supplier_id;
                            ck.num = yi.num;
                            ck.update_time = moment().format('YYYY-MM-DD HH:mm:ss');
                           // ck.back_num = yi.num;
                            return knex('t_b_product_ck').insert(ck).transacting(t);
                        //}
                    //})
                }).then(function (back) {
                    return  t_buy_inbill.query().update(data).whereIn('id',ids).transacting(t);
                });
            }).then(function (data) {
                res.send({code: 1});
            })
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });



    router.get('/inbill',function (req, res) {
        var cond =_.pick(req.body.data,'in_code','ck_id','supplier_id','in_time');
        t_buy_inbill.query().where('isdeleted',0).andWhere(cond).then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });

};