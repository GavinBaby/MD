var util = require('util');
function ParamError(message) {
    Error.captureStackTrace(this, ParamError);
    if (message) {
        this.message = message;
    }
}

util.inherits(ParamError, Error);
ParamError.prototype.name = ParamError.name;
module.exports = ParamError;