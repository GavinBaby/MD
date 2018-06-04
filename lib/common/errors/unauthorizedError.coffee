class UnauthorizedError
  constructor: (message) ->
    Error.captureStackTrace this, UnauthorizedError
    @message = message if message

module.exports = UnauthorizedError;