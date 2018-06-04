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
var javaClient = require('../configs/serviceClients').javaClient;
//var iconv = require('iconv-lite');
/*var logger = require("../configs/logHelper").helper;
logger.logOperation("操作记录1");*/

module.exports = function (app) {
    app.use('/', router);

    //查询用户列表
    router.get('/account/list', function (req, res,next) {
        var sql = knex.select('*').from('account');
        var params = req.query;
        if(params.name){
            sql = sql.where('name',params.name);
        }

        if(params.role){
            sql = sql.where('role',params.role);
        }
        if(params.state){
            sql = sql.where('status',params.status);
        }
        if(params.seq_no){
            sql = sql.where('seq_no',params.seq_no);
        }
        var infos={};
        sql.then(function (reply) {
            infos.totalSize = reply.length;
            return sql = util.queryAppend(req.query, sql);
        }).then(function (reply) {
            if (reply) {
                infos.data = reply;
                res.json(infos);
            }
        }).catch(function (err) {
            next(err);
        });
    });

    //修改或新建用户
    router.post('/account/new', function (req, res,next) {
        var params = req.body;
        var sql = knex('account');
        var time = new Date();
        time = moment().format('YYYY-MM-DD HH:mm:ss');

        //修改
        if(params.seq_no){
            sql = sql.where('seq_no',params.seq_no).update(params);
        } else {
            sql = sql.insert(params);
            params.operat_time = moment().format('YYYY-MM-DD HH:mm:ss');
            params.operat_name = req.session.sys_usernam;
        }

        sql.then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });


    //冻结
    router.get('/account/del', function (req, res,next) {
        var params = req.query;
        var sql = knex('account').where('seq_no',params.seq_no).update({state:2});
        sql.then(function (reply) {
        }).then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });

    //恢复
    router.get('/account/recovery', function (req, res,next) {
        var params = req.query;
        var sql = knex('account').where('seq_no',params.seq_no).update({state:1});
        sql.then(function (reply) {
        }).then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });
};