var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('underscore');
var Promise = require("bluebird");
var knex = require('../lib/common/mysqlClient').knex;
var BusinessError = require('../lib/common/errors/businessError');
var util = require('../lib/util.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var filter = require('../lib/filter');
var t_b_customer = require('../models/table').t_b_customer;
var t_b_product = require('../models/table').t_b_product;
var t_b_supplier = require('../models/table').t_b_supplier;
var t_dic = require('../models/table').t_dic;

module.exports = function (app) {
    app.use('/base', router);


    /*********************前端*********************/

    router.get('/supplier',function (req, res) {
        var cond = _.pick(req.query,'code','name');
        var sql=knex('t_b_supplier') ;
        if(cond.code){
            sql=sql.where('code','like','%'+cond.code+'%');
        }
        if(cond.name){
            sql=sql.where('name','like','%'+cond.name+'%');
        }
        sql.then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });

    //名称   类型： 地址：  电话号码：  传真：  法人代表：  联系人：  税号：  开户行： 账号：
    //'name','type','address','mobile','fax','fr','lxr','sh','bank','account');

 //   {"name":11,"address":"123123","mobile":"15657820119"}
    router.post('/supplier',function (req, res) {
        var main = _.pick(req.body,'code','name','type','address','mobile','fax','fr','lxr','sh','bank','account');
        knex.max('code as code').from('t_b_supplier').then(function (data) {
            main.code = Number(data[0].code || 10000) + 1;
            return t_b_supplier.query().insert(main);
        }).then(function (data) {
            res.send({data:1});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });


    router.get('/customer',function (req, res) {
        t_b_customer.query().then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });
    //名称   类型： 地址：  电话号码：  传真：  法人代表：  联系人：  税号：  开户行： 账号：业务员
    //'name','type','address','mobile','fax','fr','lxr','sh','bank','account' saleman);
    router.post('/customer',function (req, res) {
        var main = _.pick(req.body,'code','name','type','address','mobile','fax','fr','lxr','sh','bank','account','saleman','file');
        knex.max('code as code').from('t_b_customer').then(function (data) {
            main.code = (data[0].code || 10000) + 1;
            return t_b_supplier.query().insert(main);
        }).then(function (data) {
            res.send({data:1});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });
    //{"data":[{"id":1,"code":"1","barcode":"1","name_cn":"产品1","name_en":"2","supplier":"供应商code" ,"type":"类型","address":"国家","gg":"规格","price":报价,"rate":税率,
    // "watchvalue":警戒值,"weight":毛重,"file":null,"salefile":null,"sale_end":null,"create_time":null,"create_man":null,"isdeleted":"0","num":10}]}
    router.get('/product', function (req, res) {
        var cond =_.pick(req.query,'supplier','name','code','ck_code');
        var sql ="select a.*,c.num from  t_b_product a, t_dic b,   (select sum(num) as num,c.p_id,c.ck_id,c.supplier_id  from t_b_product_ck c group by c.p_id,c.ck_id,c.supplier_id) as c " +
            "where a.id=c.p_id and c.ck_id=b.code and c.supplier_id=a.supplier and b.diccode ='103' and a.isdeleted =0 ";
        if(cond.code){
            sql+= 'and a.code like %'+cond.code+'% ';
        }
        if(cond.name){
            sql+= 'and a.name like "%'+cond.name+'%" ';
        }
        if(cond.supplier){
            sql+= 'and a.supplier ="'+cond.supplier+'"';
        }
        if(cond.ck_code){
            sql+= 'and b.code ="'+cond.ck_code+'"';
        }
        knex.raw(sql).then(function (data) {
            res.send({data:data[0]});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });

    //{"data":[{"id":1,"code":"1","barcode":"1","name_cn":"产品1","name_en":"2","supplier":"供应商code" ,"type":"类型","address":"国家","gg":"规格","price":报价,"rate":税率,
    // "watchvalue":警戒值,"weight":毛重,"file":null,"salefile":null,"sale_end":null,"create_time":null,"create_man":null,"isdeleted":"0","num":10}]}
    router.post('/product',function (req, res) {
        var main = _.pick(req.body,'code','barcode','name_cn','name_en','supplier','type','address','gg','price','rate','watchvalue','weight','file' );
        knex.max('code as code').from('t_b_product').then(function (data) {
            main.code = (data[0].code || 10000) + 1;
            return t_b_product.query().insert(main);
        }).then(function (data) {
            res.send({data:1});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });
    router.get('/dic', function (req, res) {
        t_dic.query().then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send('0');
        })
    });





};