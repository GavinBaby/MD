var express = require('express');
var router = express.Router();
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('underscore');
var bookshelf = require('../lib/common/mysqlClient').bookshelf;
var Promise = require("bluebird");
var knex = require('../lib/common/mysqlClient').knex;
var BusinessError = require('../lib/common/errors/businessError');
var filter = require('../lib/filter');
var t_file = require('../models/table').t_file;
var t_apply_daily = require('../models/table').t_apply_daily;
var t_apply  = require('../models/table').t_apply ;
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');
module.exports = function (app) {
    app.use('/apply', router);
    /* 上传*/
    router.get('/daily', function(req, res, next){
        //上传完成后处理
        var cond =req.query;
        t_apply_daily.query().where(cond).then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });

    router.get('/daily/detail', function(req, res, next){
        var id =req.query.id;
        var out={};
        t_apply_daily.query().where({id:id}).then(function (data) {
            out.data = data ;
            return t_file.query().where({main_id:id});
        }).then(function (data) {
            out.files = data ;
            res.send(out);
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });


    router.get('/activity', function(req, res, next){
        //上传完成后处理
        var cond =req.query;
        t_apply.query().where(cond).then(function (data) {
            res.send({data:data});
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });

    router.get('/activity/detail', function(req, res, next){
        var id =req.query.id;
        var out={};
        t_apply.query().where({id:id}).then(function (data) {
            out.data = data ;
            return t_file.query().where({main_id:id});
        }).then(function (data) {
            out.files = data ;
            res.send(out);
        }).catch(function (err) {
            console.log("!"+err.message+"!")
            res.send({code:-1,text:err.message});
        })
    });


};