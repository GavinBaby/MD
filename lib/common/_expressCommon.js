var BusinessError = require('./errors/_businessError');
var ParamError = require('./errors/_paramError');
var UnauthorizedError = require('./errors/unauthorizedError');
var businessThrow = require('./errors/businessThrow');
var config = require(process.cwd() + '/lib/common/config');

var exception = function (err, req, res, next) {
    if (err instanceof BusinessError) {
        res.json({errCode: err.code, errText: err.message});
    } else if (err instanceof ParamError) {
        res.status(400);
        res.end();
    } else if (err instanceof UnauthorizedError) {
        res.status(401);
        res.end();
    }  else if (err instanceof businessThrow) {
        res.json({data:err.code});
    } else {
        console.log('Error: ' + req.url);
        console.log(err.stack);
        res.status(500);
        res.send(err.stack);
    }
};

var ControllerLoader = function (app) {
    this.loadAll = function (app) {
        var controllerPath = process.cwd() + '/controllers';
        require("fs").readdirSync(controllerPath).forEach(function (file) {
            require(process.cwd() + "/controllers/" + file)(app);
        });
        app.use(exception);
    };
};

module.exports = {
    session: function(redis, gen_session_id) {
        var session = require('express-session');
        var store = null;
        if (redis) {
            var RedisStore = require('connect-redis')(session);
            store = new RedisStore({host: config.redis.host, port: config.redis.port});
            store.on('connect', function() {
                console.log('session store connected!');
            });
            store.on("disconnect", function (err) {
                console.log('session store disconnected!');
            });
        }

        var option = {
            store: store,
            secret: config.session_secret || 'keyboard cat',
            resave: false,
            saveUninitialized: false
        };
        if (!gen_session_id) {
            option.genid = function() {};
        }
        var sessionProcess = session(option);
        return function(req, res, next) {
            if (req && req.headers.authorization && req.headers.authorization.indexOf ('Bearer ') == 0) {
                next();
            } else {
                sessionProcess(req, res, next);
            }
        }
    },
    controllerLoader: new ControllerLoader(),
    BusinessError: BusinessError,
    ParamError: ParamError,
    UnauthorizedError: UnauthorizedError
};