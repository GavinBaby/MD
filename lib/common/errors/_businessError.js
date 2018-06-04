var util = require('util');
function BusinessError(code, message) {
    Error.captureStackTrace(this, BusinessError);
    if (code) {
        this.code = code;
    }
    if (message) {
        this.message = message;
    }
}

util.inherits(BusinessError, Error);
BusinessError.prototype.name = BusinessError.name;
module.exports = BusinessError;