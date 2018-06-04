class BusinessError extends Error
  constructor: (code, message) ->
    Error.captureStackTrace this, BusinessError
    @code = code if code
    @message = message if message

module.exports = BusinessError