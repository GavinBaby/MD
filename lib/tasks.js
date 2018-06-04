var schedule = require('node-schedule');
var thisClient = require('../configs/serviceClients').thisClient;
var javaClient = require('../configs/serviceClients').javaClient;
var moment = require('moment');
var iconv = require('iconv-lite');
var Promise = require("bluebird");
var scheduleExecte = function () {


    //每日分红和管理奖
    this.updateSys  = function(){

        var rule = new schedule.RecurrenceRule();
        rule.minute = 0;
        var j=  schedule.scheduleJob(rule, function() {
            try{
                var apiUrl = '/JCSW/web/publicmenus/Timedtask_execute_client.action';
                var apiArg = {parameters:{status:1}};
                javaClient.get(apiUrl,apiArg).then(function(result){
                    var data = iconv.decode(result.body,'gb2312');
                    data =data.toString();
                    if(data){
                        data =JSON.parse(data);
                        if(data.rows&&data.rows.length>0){
                            return Promise.map(data.rows, function (task) {
                                console.log("定时执行中");
                                var apiUrl_ = '/JCSW/web/publicmenus/Meterread_areaReading_client.action';
                                var apiArg_ = {parameters:{areaId:task.jid,createUser:task.createUser,type:task.cystype,seqNo:task.seqNo}};
                                return javaClient.get(apiUrl_,apiArg_)
                            });
                        }else{
                            return ;
                        }

                    }
                }).then(function(result){
                    console.log("定时任务完成");
                }).catch(function (err) {
                    console.log("定时任务失败");
                });
                return j;
            }catch(e){
                console.log("定时任务失败");
                return j;
            }

        })
    }
}
module.exports   = new scheduleExecte();