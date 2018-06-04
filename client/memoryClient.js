'use strict';
var cache = require('memory-cache');


exports.setex  = function(type,key,timeout,value){
   if(value){
     return cache.put(type + ':' + key,value,timeout);
   }else{
     return cache.put(type + ':' + key,timeout);
   }
};
exports.set  = function(type,key,value){
    return cache.put(type + ':' + key,value);
};

exports.get  = function(type,key){
  return cache.get(type + ':' + key);
};

exports.del  = function(type,key){
  return cache.del(type + ':' + key);
};






