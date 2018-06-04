class MysqlClient
  initialize: (connection) ->
    @knex = require('knex-mycat') client: 'mysql', connection: connection, debug: true
    @bookshelf = require('bookshelf') @knex, debug: true

module.exports = new MysqlClient()