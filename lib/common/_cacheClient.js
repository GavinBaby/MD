var redis = require('redis');
var Promise = require('bluebird');

var CacheClient = function () {
    this.initialize = function (option) {
        option = option || {};
        var client = redis.createClient(option.port, option.host);

        if (option.password) {
            client.auth(option.password);
        }

        if (option.database) {
            client.select(option.database);
        }

        client.on("error", function (err) {
            console.log( err);
        });

        client.on('connect', function() {
            console.log('redis connected!');
        });

        this.set = function (type, key, value) {
            return new Promise(function (resolve, reject) {
                client.set(type + ':' + key, JSON.stringify(value), function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    resolve(reply);
                });
            });
        };

        this.setex = function (type, key, seconds, value) {
            return new Promise(function (resolve, reject) {
                client.setex(type + ':' + key, seconds, JSON.stringify(value), function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    resolve(reply);
                });
            });
        };

        this.get = function (type, key) {
            return new Promise(function (resolve, reject) {
                client.get(type + ':' + key, function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    if (reply) {
                        var o = JSON.parse(reply);
                        resolve(o);
                    } else {
                        resolve(null);
                    }
                });
            });
        };

        this.del = function (type, key) {
            return new Promise(function (resolve, reject) {
                client.del(type + ':' + key, function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    resolve(reply);
                });
            });
        };

        this.expire = function (type, key, seconds) {
            return new Promise(function (resolve, reject) {
                client.expire(type + ':' + key, seconds, function (err, reply) {
                    if (err) {
                        reject(err);
                    }
                    resolve(reply);
                });
            });
        };

        this.mget = function (type, keys) {
            return new Promise(function (resolve, reject) {
                var typeKeys = [];
                keys.forEach(function (key) {
                    typeKeys.push(type + ':' + key);
                });
                client.mget(typeKeys, function (err, replies) {
                    if (err) {
                        reject(err);
                    }

                    if (replies != null) {
                        var objects = [];
                        replies.forEach(function (reply) {
                            var o = JSON.parse(reply);
                            objects.push(o);
                        });
                        resolve(objects);
                    }
                    else {
                        resolve(null);
                    }
                });
            });
        };
    };
};
module.exports = new CacheClient();