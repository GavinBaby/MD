var express = require('express');
var path = require('path');

//var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressCommon = require('./lib/common/expressCommon');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var config = require('./configs/config');
var mysqlClient = require('./lib/common/mysqlClient');
mysqlClient.initialize(config.mysql);

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: false}));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'name',
    cookie: {maxAge: 70000000},
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'),{
    setHeaders:function(res,path,stat) {
        if(res && path.indexOf("upload\\")>-1) {
            var ceshi = path.split(".");
                var name = ceshi[0].substring(path.indexOf("upload\\")+7,ceshi[0].length);
                //res.setHeader("ContentType","application/octet-stream");
                res.setHeader("Content-Disposition","attachment; filename="+name+"."+ceshi[1]);//Content-disposition
        }
    }
}));


/*var tasks = require(process.cwd() + '/lib/tasks.js');
tasks.updateSys();*/

app.set('view engine', 'ejs');



expressCommon.controllerLoader.loadAll(app);
//
module.exports = app;
