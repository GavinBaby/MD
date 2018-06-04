var util = require('util');
function UnauthorizedError(message) {
    Error.captureStackTrace(this, UnauthorizedError);
    if (message) {
        this.message = message;
    }
}

util.inherits(UnauthorizedError, Error);
UnauthorizedError.prototype.name = UnauthorizedError.name;
module.exports = UnauthorizedError;