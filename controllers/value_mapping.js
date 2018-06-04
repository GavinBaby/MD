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
module.exports = function (app) {
    app.use('/', router);

    //查询数据字典列表
    router.get('/value_mapping/list', function (req, res,next) {
        var sql = knex.select('*').from('t_dic').where('diccode',0)
        var params = req.query;
        if(params.code){
            sql = sql.where('code', params.code);
        }
        if(params.diccode){
            sql = sql.where('diccode', params.diccode);
        }
        if(params.pid){
            sql = sql.where('type',params.pid);
        }
        if(params.dicname){
            sql = sql.where('type','like','%'+params.dicname+'%');
        }
        if(params.key_id){
            sql = sql.where('key_id',params.key_id);
        }
        var infos={};
        sql.then(function (reply) {
            infos.totalSize = reply.length;
            return sql = util.queryAppend(req.query, sql)
        }).then(function (reply) {
            if (reply) {
                infos.data = reply;
                res.json(infos);
            }
        }).catch(function (err) {
            next(err);
        });
    });

    //查询详情
    router.get('/value_mapping/get', function (req, res, next) {
        var pro = req.body;
        var num1 = req.query.num1;
        var sql = knex.select('*').from('t_dic').where('id',num1);
        // 执行sql
        sql.then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });
    //更新
    router.post('/value_mapping/update', function (req, res, next) {
        var pro = req.body;
        var num1 = req.body.id;
        var sql = knex('t_dic').update(pro).where('id',num1);
        var state=true;
        knex.select('*').from('t_dic').where('pid',pro.pid).whereNotIn('id', [num1]).then(function (reply) {
            if(reply&&reply.length>0){
                state=false;
                return;
            }else{
                return sql;
            }
        }).then(function (reply) {
            res.json({state: state});
        }).catch(function (err) {
            next(err);
        });
    });
    //删除
    router.post('/value_mapping/del', function (req, res, next) {
        var num1 = req.query.num1;
        var sql = knex('t_dic').where('id',num1).del();
        sql.then(function (reply) {
            res.json();
        }).catch(function (err) {
            next(err);
        });
    });

    //新建
    router.post('/value_mapping/insert', function (req, res, next) {
        var pro = req.body;
        var sql = knex('t_dic').insert(pro);
        var state=true;
        knex.select('*').from('t_dic').where('pid',pro.pid).then(function (reply) {
            if(reply&&reply.length>0){
                state=false;
                return;
            }else{
                return sql;
            }
        }).then(function (reply) {
            res.json({state: state});
        }).catch(function (err) {
            next(err);
        });
    });
    //查询num1
    router.get('/value_mapping/select', function (req, res, next) {
        var sql = knex.select('*').from('value_mapping').orderBy('num1','desc');
        // 执行sql
        sql.then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });
};