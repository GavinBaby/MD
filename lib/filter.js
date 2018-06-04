exports.authorize = function(req, res, next) {
    if (!req.session.sys_userid) {
        res.redirect('/login');
    } else {
        next();
    }
};