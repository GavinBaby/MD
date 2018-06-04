commonClient = require(process.cwd() + '/configs/serviceClients').commonClient
Promise = require 'bluebird'

class SeqGenerator
  #    // 获得下一个序列号
  getNext: (type, pad) ->
    para =
      system: true
      parameters:
        type: type
    para.parameters.pad = pad if pad
    commonClient.get('/sequences/next', para).then (response) ->
      if response && response.body && response.body.data
        Promise.resolve response.body.data
      else
        Promise.reject errCode: 500, errText: response.statusMessage

#    // 获得指定数量的序列号，以数组返回
  getMulti: (type, count, pad) ->
    para =
      system: true
      parameters:
        type: type
        count: count
    para.parameters.pad = pad if pad
    Promise.resolve [] if count is 0
    commonClient.get('/sequences/Multi', para).then (response) ->
      if response && response.body && response.body.data
        Promise.resolve response.body.data
      else
        Promise.reject errCode: response.statusCode, errText: response.statusMessage

module.exports = new SeqGenerator()