class ParamError
  constructor: (message) ->
    Error.captureStackTrace this, ParamError
    @message = message if message

module.exports = ParamError