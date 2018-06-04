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
    router.get('/menu/list', function (req, res,next) {
        var sql = knex.select('*').from('menu');
        var infos={};
        if(req.query.menus){
            var menus = req.query.menus.split(",");
            sql = sql.whereIn('seq_no',menus);
        }
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

};