var commonClient = require(process.cwd() + '/configs/serviceClients').commonClient;
var Promise = require('bluebird');

function SeqGenerator() {
    // 获得下一个序列号
    this.getNext = function (type,pad) {
        var para ={system: true, parameters: {type: type}};
        if(pad)
            para.parameters.pad= pad ;
        return new Promise(function (resolve, reject) {
            commonClient.get('/sequences/next',para ).then(function (response) {
                if (response && response.body && response.body.data) {
                    resolve(response.body.data);
                } else {
                    reject({errCode:500,errText:response.statusMessage});
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    // 获得指定数量的序列号，以数组返回
    this.getMulti = function (type, count,pad) {
        var para ={  system: true, parameters: {type: type, count: count} }
        if(pad)
            para.parameters.pad= pad ;
        return new Promise(function (resolve, reject) {
            if(count == 0 ){
                resolve([]);
            }
            commonClient.get('/sequences/Multi',para ).then(function (response) {
                if (response && response.body && response.body.data) {
                    resolve(response.body.data);
                } else {
                    reject({errCode:response.statusCode,errText:response.statusMessage});
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}

module.exports = new SeqGenerator();