fs = require 'fs-extra'

deepMerge = (target, source) ->
  for sourcekey, sourceValue of source
    targetValue = target[sourcekey]
    if targetValue && sourceValue && typeof sourceValue == 'object'
      deepMerge targetValue, sourceValue
    else
      target[sourcekey] = sourceValue
  return target

config = require process.cwd() + '/configs/config.share'
env = process.env.ENV || 'local'
file_extra = process.cwd() + '/configs/config.' + env + '.js'
try
  config_extra = require file_extra
  config = deepMerge config, config_extra
catch err
  console.log err
module.exports = config;