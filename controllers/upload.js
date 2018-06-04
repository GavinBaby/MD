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
var t_apply = require('../models/table').t_apply;
var multiparty = require('multiparty');
var fs = require('fs');
var util = require('util');
module.exports = function (app) {
    app.use('/upload', router);
    /* 上传*/
    router.post('/file/uploading', function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err){
                console.log('parse error: ' + err);
            } else {
                console.log('parse files: ' + filesTmp);
                if(!files.inputFile){
                    files.inputFile=[];
                }
                var savefiles=[];
                files.inputFile.forEach(function(e){
                    var inputFile = e;
                    if(!inputFile.originalFilename){
                        fs.unlink(inputFile.path);
                    }
                    var uploadedPath = inputFile.path;
                    //var dstPath = './public/upload/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    var names = uploadedPath.split('\\');
                    savefiles.push({name:names[2],old_name:inputFile.originalFilename});
                })
                    //fs.rename(uploadedPath, dstPath, function(err) {
                    //    if(err){
                    //        console.log('rename error: ' + err);
                    //    } else {
                    //        console.log('rename ok');
                    //    }
                    //});
                    var main ={};
                    main.daily_data=fields.daily_data[0];
                    main.daily_man=fields.daily_man[0];
                    main.department=fields.department[0];
                    main.state=fields.state[0];
                    main.body=fields.body[0];
                    bookshelf.transaction(function (t) {
                        return knex.max('id as id').from('t_apply_daily').then(function (data) {
                            main.id = (data[0].id || 0) + 1;
                            savefiles.forEach(function (e,i) {
                                savefiles[i].main_id = main.id;
                            });
                            return t_apply_daily.query().insert(main).transacting(t);
                        }).then(function (data) {
                            return t_file.query().insert(savefiles).transacting(t);
                        }).then(function (data) {
                            res.send({code: 1});
                        })
                    }).catch(function (err) {
                        console.log("!"+err.message+"!")
                        res.send({code:-1,text:err.message});
                    })
            }
        });
    });
    router.post('/file/uploading/update', function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err){
                console.log('parse error: ' + err);
            } else {
                console.log('parse files: ' + filesTmp);
                if(!files.inputFile){
                    files.inputFile=[];
                }
                var savefiles=[];
                files.inputFile.forEach(function(e){
                    var inputFile = e;
                    if(!inputFile.originalFilename){
                        fs.unlink(inputFile.path);
                    }
                    var uploadedPath = inputFile.path;
                    //var dstPath = './public/upload/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    var names = uploadedPath.split('\\');
                    savefiles.push({name:names[2],old_name:inputFile.originalFilename});
                })
                var main ={};
                main.id=fields.id[0];
                main.sh_man=fields.sh_man[0];
                main.sh_data=fields.sh_data[0];
                main.sh_yj=fields.sh_yj[0];
                bookshelf.transaction(function (t) {
                    return knex.max('id as id').from('t_apply_daily').then(function (data) {
                        main.id = (data[0].id || 0) + 1;
                        savefiles.forEach(function (e,i) {
                            savefiles[i].main_id = main.id;
                        });
                        return t_apply_daily.query().update(main).where({id:main.id}).transacting(t);
                    }).then(function (data) {
                        return t_file.query().delete().where({main_id:main.id}).transacting(t);
                    }).then(function (data) {
                        return t_file.query().insert(savefiles).transacting(t);
                    }).then(function (data) {
                        res.send({code: 1});
                    })
                }).catch(function (err) {
                    console.log("!"+err.message+"!")
                    res.send({code:-1,text:err.message});
                })
            }
        });
    });

    //活动
    /* 上传*/
    router.post('/activity/uploading', function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err){
                console.log('parse error: ' + err);
            } else {
                console.log('parse files: ' + filesTmp);
                if(!files.inputFile){
                    files.inputFile=[];
                }
                var savefiles=[];
                files.inputFile.forEach(function(e){
                    var inputFile = e;
                    if(!inputFile.originalFilename){
                        fs.unlink(inputFile.path);
                    }
                    var uploadedPath = inputFile.path;
                    //var dstPath = './public/upload/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    var names = uploadedPath.split('\\');
                    savefiles.push({name:names[2],old_name:inputFile.originalFilename});
                })
                //fs.rename(uploadedPath, dstPath, function(err) {
                //    if(err){
                //        console.log('rename error: ' + err);
                //    } else {
                //        console.log('rename ok');
                //    }
                //});
                var main ={};
                main.daily_data=fields.daily_data[0];
                main.daily_man=fields.daily_man[0];
                main.department=fields.department[0];
                main.state=fields.state[0];
                main.body=fields.body[0];
                bookshelf.transaction(function (t) {
                    return knex.max('id as id').from('t_apply_daily').then(function (data) {
                        main.id = (data[0].id || 0) + 1;
                        savefiles.forEach(function (e,i) {
                            savefiles[i].main_id = main.id;
                        });
                        return t_apply.query().insert(main).transacting(t);
                    }).then(function (data) {
                        return t_file.query().insert(savefiles).transacting(t);
                    }).then(function (data) {
                        res.send({code: 1});
                    })
                }).catch(function (err) {
                    console.log("!"+err.message+"!")
                    res.send({code:-1,text:err.message});
                })
            }
        });
    });
    router.post('/activity/uploading/update', function(req, res, next){
        //生成multiparty对象，并配置上传目标路径
        var form = new multiparty.Form({uploadDir: './public/upload/'});
        //上传完成后处理
        form.parse(req, function(err, fields, files) {
            var filesTmp = JSON.stringify(files,null,2);
            if(err){
                console.log('parse error: ' + err);
            } else {
                console.log('parse files: ' + filesTmp);
                if(!files.inputFile){
                    files.inputFile=[];
                }
                var savefiles=[];
                files.inputFile.forEach(function(e){
                    var inputFile = e;
                    if(!inputFile.originalFilename){
                        fs.unlink(inputFile.path);
                    }
                    var uploadedPath = inputFile.path;
                    //var dstPath = './public/upload/' + inputFile.originalFilename;
                    //重命名为真实文件名
                    var names = uploadedPath.split('\\');
                    savefiles.push({name:names[2],old_name:inputFile.originalFilename});
                })
                var main ={};
                main.id=fields.id[0];
                main.sh_man=fields.sh_man[0];
                main.sh_data=fields.sh_data[0];
                main.sh_yj=fields.sh_yj[0];
                bookshelf.transaction(function (t) {
                    return knex.max('id as id').from('t_apply_daily').then(function (data) {
                        main.id = (data[0].id || 0) + 1;
                        savefiles.forEach(function (e,i) {
                            savefiles[i].main_id = main.id;
                        });
                        return t_apply.query().update(main).where({id:main.id}).transacting(t);
                    }).then(function (data) {
                        return t_file.query().delete().where({main_id:main.id}).transacting(t);
                    }).then(function (data) {
                        return t_file.query().insert(savefiles).transacting(t);
                    }).then(function (data) {
                        res.send({code: 1});
                    })
                }).catch(function (err) {
                    console.log("!"+err.message+"!")
                    res.send({code:-1,text:err.message});
                })
            }
        });
    });


};