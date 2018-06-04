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

    //查询角色权限列表
    router.get('/role/list', function (req, res,next) {
        var sql = knex.select('*').from('role')
        var params = req.query;
        if(params.seq_no){
            sql = sql.where('seq_no', params.seq_no);
        }
        if(params.name){
            sql = sql.where('name',params.name);
        }
        if(params.time_str){
            sql = sql.where('operat_time','>=',params.time_str);
        }
        if(params.time_end){
            sql = sql.where('operat_time','<=',params.time_end);
        }
        if(params.state){
            sql = sql.where('state',params.state);
        }
        var infos={};
        sql.then(function (reply) {
            infos.totalSize = reply.length;
            return sql = util.queryAppend(req.query, sql)
        }).then(function (reply) {
            if (reply) {
                for(var i =0;i<reply.length;i++){
                    reply[i].operat_time = moment(reply[i].operat_time).format('YYYY-MM-DD');
                }
                infos.data = reply;
            }
            var record_info = {
                role:1,
                type:"查看",
                remark:"角色列表",
                operat_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                operat_name:req.session.sys_username
            }
            if(req.query.ip){
                record_info.ip = req.query.ip
            }
            return knex('operate_record').insert(record_info);
        }).then(function (reply) {
            res.json(infos);
        }).catch(function (err) {
            next(err);
        });
    });
    //查询详情
    router.get('/role/get', function (req, res, next) {
        var info = {}
        var seq_no = req.query.seq_no;
        var sql = knex.select('*').from('role').where('seq_no',seq_no);
        // 执行sql
        sql.then(function (reply) {
            if(reply&&reply.length>0){
                info.data=reply[0];
                var menu_ids = info.data.menu_id.split(",");

                return knex.select('*').from('menu').whereIn('seq_no',menu_ids);
            }else{
                return ;
            }

        }).then(function (reply) {
            if(reply&&reply.length>0){
                info.menu_list=reply;
            }
            var record_info = {
                role:1,
                type:"查看",
                remark:"角色详情（编号："+req.query.seq_no+"）",
                operat_time:moment().format('YYYY-MM-DD HH:mm:ss'),
                operat_name:req.session.sys_username
            }
            if(req.query.ip){
                record_info.ip = req.query.ip
            }
            return knex('operate_record').insert(record_info);
        }).then(function (reply) {
            res.json(info);
        }).catch(function (err) {
            next(err);
        });
    });
    //修改或新建
    router.post('/role/edit', function (req, res, next) {
        var params = _.pick(req.body,'seq_no', 'menu_id', 'name','remark','state');
        var sql = knex('role');
        var record_info = {
            role:1,
            operat_time:moment().format('YYYY-MM-DD HH:mm:ss'),
            operat_name:req.session.sys_username
        }
        if(params.seq_no){
            sql = sql.where('seq_no',params.seq_no).update(params);
            record_info.type="修改";
            record_info.remark="修改角色信息（编号："+params.seq_no+"）";
        } else {
            params.operat_time = moment().format('YYYY-MM-DD HH:mm:ss');
            params.operat_name =req.session.sys_username;
            sql = sql.insert(params);
            record_info.type="添加";
            record_info.remark="添加角色 "+params.name;
        }
        sql.then(function (reply) {
            return knex('operate_record').insert(record_info);
        }).then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });
    //删除
    router.post('/role_info/del', function (req, res, next) {
        var params = _.pick(req.body, 'seq_no', 'name');
        var sql = knex('role').where('seq_no',params.seq_no).del();
        sql.then(function (reply) {
            res.json(reply);
        }).catch(function (err) {
            next(err);
        });
    });

};