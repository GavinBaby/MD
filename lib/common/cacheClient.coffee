redis = require('redis')
Promise = require('bluebird')

class CacheClient
  initialize: (option) ->
    option = option || {};
    client = redis.createClient option.port, option.host


    client.auth option.password if option.password

    client.select option.database if option.database


    client.on "error", (err) ->
      console.log err

    client.on 'connect', () ->
      console.log 'redis connected!'

    @set = (type, key, value) ->
      new Promise (resolve, reject) ->
        client.set type + ':' + key, JSON.stringify(value), (err, reply) ->
          reject err if err
          resolve reply

    @setex = (type, key, seconds, value) ->
      new Promise (resolve, reject) ->
        client.setex type + ':' + key, seconds, JSON.stringify(value), (err, reply) ->
          reject err if err
          resolve reply

    @get = (type, key) ->
      new Promise (resolve, reject) ->
        client.get type + ':' + key, (err, reply) ->
          reject err if err
          if reply
            o = JSON.parse(reply)
            resolve o
          else
            resolve null

    @del = (type, key) ->
      new Promise (resolve, reject) ->
        client.del type + ':' + key, (err, reply) ->
          reject err if err
          resolve reply

    @expire = (type, key, seconds) ->
      new Promise (resolve, reject) ->
        client.expire type + ':' + key, seconds, (err, reply) ->
          reject err if err
          resolve reply

    @mget = (type, keys) ->
      typeKeys = []
      keys.forEach (key) ->
        typeKeys.push type + ':' + key
      new Promise (resolve, reject) ->
        client.mget typeKeys, (err, replies) ->
          reject err if err
          if replies
            objects = [];
            replies.forEach (reply) ->
              o = JSON.parse reply
              objects.push o
            resolve objects
          else
            resolve null

module.exports = new CacheClient()