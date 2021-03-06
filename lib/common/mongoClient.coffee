class MongoClient
  initialize: (config) ->
    mongoose = require 'mongoose'
    connection = mongoose.connection
    db = mongoose.connection
    db.on 'connecting', () ->
      console.log 'connecting to MongoDB...'
    db.on 'error', (error) ->
      console.error 'Error in MongoDb connection: ' + error
      mongoose.disconnect()
    db.on 'connected', () ->
      console.log 'MongoDB connected!'
    db.once 'open', () ->
      console.log 'MongoDB connection opened!'

    db.on 'reconnected', () ->
      console.log 'MongoDB reconnected!'
    db.on 'disconnected', () ->
      console.log 'MongoDB disconnected!'
      mongoose.connect config, server:
        auto_reconnect: true
    mongoose.connect config, server:
      auto_reconnect: true
    @mongoose = mongoose
    @connection = connection

module.exports = new MongoClient()