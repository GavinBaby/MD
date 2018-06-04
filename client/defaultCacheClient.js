'use strict';

var MemoryClient = require('./memoryClient');

if(process.env.ENV|| 'local'==='local'){
    module.exports = MemoryClient;
}else{
    module.exports =MemoryClient;
}
