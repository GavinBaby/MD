var fs = require('fs-extra');

var deepMerge = function (target, source) {
    for (var key in source) {
        var targetValue = target[key];
        var sourceValue = source[key];
        if (targetValue && sourceValue && typeof sourceValue == 'object') {
            deepMerge(targetValue, sourceValue);
        } else {
            target[key] = sourceValue;
        }
    }
    return target;
};

var config = require(process.cwd() + '/configs/config');
//var env = process.env.ENV || 'local';
var file_extra = process.cwd() + '/configs/config.js';
try {
    var config_extra = require(file_extra);
    config = deepMerge(config, config_extra);
} catch (err) {
    console.log(err);
}
module.exports = config;