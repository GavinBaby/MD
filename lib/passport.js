// 加载所有认证策略
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var debug = require('debug')('weshop-web');
var clients = require('../configs/serviceClients');
var authClient = clients.authClient;

var weshopClient =clients.weshopClient;
var rememberMeTimeoutLong = require('../lib/common/config').rememberMeTimeoutLong;
var passport = require('passport');
var systemBearerToken = require('../lib/common/config').systemBearerToken;

// 将用户序列化到缓存或数据库中，可以是缓存或数据库
passport.serializeUser(function(user, done) {
    if (user && user.tokenId) {
        done(null, user.tokenId);
    } else {
        done(null, user);
    }
});

// 从缓存或数据库中获取用户
passport.deserializeUser(function(id, done) {
    authClient.get('/tokens/${id}', {system: true, path: {id: id}}).then(function(response){
        if (response.body.data) {
            done(null, response.body.data);
        } else {
            done(null, false);
        }
    }).catch(function(err){
        done(err, false);
    });
});

// =========================================================================
// 平台自有帐户WEB登录认证策略 ================================================
// =========================================================================
passport.use('local-login', new LocalStrategy({
        // 自定义认证时由客户端表单提交所使用的字段名，默认使用username和password
        usernameField: 'loginName',
        passwordField: 'password',
        passReqToCallback: true, // 允许我们从route中传递req对象(检查用户是否登录)
        session: false
    },
    function (req, loginName, password, done) {
        // 异步
        process.nextTick(function () {
            authClient.post('/tokens', {
                system: true,
                data: {
                    loginName: loginName,
                    password: password,
                    remember: req.body.remember === undefined ? 0 : 1,
                    clientType: 0
                }
            }).then(function (response) {
                if (response.body.errCode!=undefined) {
                    req.errText = response.body.errText;
                    return done(null, req.errText);
                }
                // 全部无误，返回user对象
                else {
                    return done(null, response.body.data);
                }
                //done(null, response.body.data);
            }).catch(function (err) {
                return done(err);
            });
        });
    })
);

passport.use('bearer', new BearerStrategy(
    function (tokenId, done) {
        if (systemBearerToken === tokenId) {
            done(null, {tokenId: tokenId, accId: '000000000000000000000000', displayName: 'system'});
        } else {
            authClient.get('/tokens/${id}', {system: true, path: {id: tokenId}}).then(function (response) {
                if (response.body.data) {
                    done(null, response.body.data);
                } else {
                    done(null);
                }
            }).catch(function (err) {
                done(err);
            });
        }
    }
));

module.exports.login = passport.authenticate('local-login');

module.exports.authenticate = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        passport.authenticate(['bearer'], {session: false})(req, res, next);
    }
};
