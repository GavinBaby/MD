function MysqlClient() {
    this.initialize = function (connection) {
        this.knex = require('knex-mycat')({client: 'mysql', connection: connection, debug: true});
        this.bookshelf = require('bookshelf')(this.knex, {debug: true});
    }
}

module.exports = new MysqlClient();