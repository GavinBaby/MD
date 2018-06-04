BusinessError = require './errors/businessError'
ParamError = require './errors/paramError'
UnauthorizedError = require './errors/unauthorizedError'
config = require process.cwd() + '/lib/common/config'

exception = (err, req, res, next) ->
    if err instanceof BusinessError
        res.json errCode: err.code, errText: err.message
    else if err instanceof ParamError
        res.status 400
        res.end()
    else if err instanceof UnauthorizedError
        res.status 401
        res.end()
    else
        console.log 'Error: ' + req.url
        console.log err.stack
        res.status 500
        res.send err.stack

class ControllerLoader
    loadAll: (app) ->
        app.disable 'x-powered-by'
        controllerPath = process.cwd() + '/controllers'
        require('fs').readdirSync(controllerPath).forEach (file) ->
            require(process.cwd() + '/controllers/' + file)(app)
        app.use exception

module.exports =
    session:
        (redis, gen_session_id) ->
            session = require 'express-session'
            store = null;
            if redis
                RedisStore = require('connect-redis')(session)
                store = new RedisStore host: config.redis.host, port: config.redis.port
                store.on 'connect', () ->
                    console.log 'session store connected!'

                store.on 'disconnect', (err) ->
                    console.log 'session store disconnected!'

            option =
                store: store
                secret: config.session_secret || 'keyboard cat'
                resave: false
                saveUninitialized: false

            if !gen_session_id
                option.genid = () ->

            sessionProcess = session option;
            return (req, res, next) ->
                if req && req.headers.authorization && req.headers.authorization.indexOf ('Bearer ') == 0
                    next()
                else
                    sessionProcess req, res, next

    controllerLoader: new ControllerLoader()
    BusinessError: BusinessError
    ParamError: ParamError
    UnauthorizedError: UnauthorizedError
