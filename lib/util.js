var _ = require('underscore');
var moment = require('moment');
var knex = require('../lib/common/mysqlClient').knex;
var util = function () {
    // 检查分页参数传入
    this.checkQuery = function (query) {
        var query = _.pick(query, 'recordStart', 'pageSize', 'sortName', 'sortType');
        if (!query.recordStart && query.pageSize)
            return false;
        if (query.recordStart && !query.pageSize)
            return false;
        if (query.sortType && !query.sortName)
            return false;

        return true;
    };
    // 判断是否分页
    this.isPage = function (query) {
        var query = _.pick(query, 'recordStart', 'pageSize', 'sortName', 'sortType');
        if (query.recordStart && query.pageSize)
            return true;
        else
            return false;
    };

    // 分页sql拼接
    this.queryAppend = function (query, sql) {
        if (query.sortName) {
            sql = sql.orderBy(query.sortName, query.sortType || 'asc');
        }
        if (query.pageSize) {
            sql = sql.limit(parseInt(query.pageSize)).offset(parseInt(query.recordStart));
        }
        return sql;
    };


    // 操作日志
    this.logger = function (object, account, type) {
        var user = _.pick(account, "accId", "username");

        if (type == 1) {
            object.operator_id = user.accId;
            object.operator_name = user.username || '0000000000';
            object.zone = object.supplier_id || user.supplier_id;
            object.operat_time = moment().format('YYYY-MM-DD HH:mm:ss');
        } else {
            object.modifier_id = user.accId;
            object.modifier_name = user.username || '0000000000';
            object.modifi_time = moment().format('YYYY-MM-DD HH:mm:ss');
        }
    }

    // 获得6位不重复的账号
    this.extendCode = {
        check: function (arr) {
            var extend_code = "";
            for (var i = 0; i < 6; i++) {
                extend_code += Math.floor(Math.random() * 10);
            }
            if (arr.indexOf(extend_code) == -1) {
                return extend_code;
            } else {
                util.extendCode.check(arr);
            }
        },
        noCheck: function () {
            var extend_code = "";
            for (var i = 0; i < 6; i++) {
                extend_code += Math.floor(Math.random() * 10);
            }
            return extend_code;
        }
    };

    // 获得两个日期之间的天数 包括当天和最后一天
    this.DateDiff = function (sDate1, sDate2) {    // sDate1和sDate2是2002-12-18格式
        var aDate, oDate1, oDate2, iDays;
        aDate = sDate1.split("-");
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);   // 转换为12-18-2002格式
        aDate = sDate2.split("-");
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒数转换为天数
        //iDays++;
        return iDays;
    };

    // 天数加1
    this.DateAdd = function (sDate) {          // sDate是2002-12-18格式
        sDate = new Date(sDate.replace("-", "/"));
        sDate.setDate(sDate.getDate() + 1);
        sDate = moment(sDate).format('YYYY-MM-DD');
        return sDate;
    };


}

module.exports = new util();