Client = require('node-rest-client').Client
Promise = require 'bluebird'
systemBearerToken = require(process.cwd() + '/lib/common/config').systemBearerToken

class RestClient
  constructor: (options) ->
    options.mimetypes =
      json: ["application/json", "application/json; charset=utf-8"]
      xml: ["application/xml", "application/xml; charset=utf-8"]
    baseUrl = options.baseUrl || 'http://127.0.0.1';
    client = new Client(options);

    setDefaultArgs = (args) ->
      args = args || {};
      args.headers = args.headers || {};
      args.headers['Content-Type'] = args.headers['Content-Type'] || 'application/json; charset=utf-8';
      authorizationAddedFlag = false;
      if !authorizationAddedFlag && args.req && args.req.headers && args.req.headers.authorization
        args.headers['Authorization'] = args.req.headers.authorization
        authorizationAddedFlag = true
      if !authorizationAddedFlag && args.req && args.req.user && args.req.user.tokenId
        args.headers['Authorization'] = 'Bearer ' + args.req.user.tokenId
        authorizationAddedFlag = true

      if !authorizationAddedFlag && args.system
        args.headers['Authorization'] = 'Bearer ' + systemBearerToken
        authorizationAddedFlag = true
      if !authorizationAddedFlag && args.req && args.req.headers && args.req.headers.cookie
        args.headers['Cookie'] = args.req.headers.cookie
        authorizationAddedFlag = true

    #        // ---------------------------------------------------------------------------------------------------------------
    #        // url和args示例:
    #        // url: /users/${id}
    #        // args: {path: {id: 1}, parameters: {type: '0'}, data: {displayName: 'zhangsan', password: '123'}, req: req, system: true}
    #        // 说明：path为路径模板，path的id字段将会替换url中的${id}, parameters为查询参数,data为Body数据, req为请求调用者，
    #        //       system为true表示系统调用，req和system对调用者进行授权认证，二者选一，没有req时设置system为true，二者都不传将授权失败
    #        // 最终的url: /users/1?type=0
    #        // 请求的Body数据: {displayName: 'zhangsan', password: '123'}
    #        // 返回结果response.body为Body数据
    #        // ---------------------------------------------------------------------------------------------------------------


    @get = (url, args) ->
      setDefaultArgs args
      new Promise (resolve, reject) ->
        client.get(baseUrl + url, args, (data, response) ->
          if parseInt(response.statusCode / 100) == 2 || parseInt(response.statusCode / 100) == 3
            response.body = data
            resolve response
          else
            response.body = data.toString()
            reject response
        ).on 'error', (err) ->
          console.log 'rest client @get error: ' + baseUrl + url
          reject err

    @post = (url, args) ->
      setDefaultArgs args
      new Promise (resolve, reject) ->
        client.post(baseUrl + url, args, (data, response) ->
          if parseInt(response.statusCode / 100) == 2 || parseInt(response.statusCode / 100) == 3
            response.body = data
            resolve response
          else
            response.body = data.toString()
            reject response
        ).on 'error', (err) ->
          console.log 'rest client @post error: ' + baseUrl + url
          reject err

    @put = (url, args) ->
      setDefaultArgs args
      new Promise (resolve, reject) ->
        client.put(baseUrl + url, args, (data, response) ->
          if parseInt(response.statusCode / 100) == 2 || parseInt(response.statusCode / 100) == 3
            response.body = data
            resolve response
          else
            response.body = data.toString()
            reject response
        ).on 'error', (err) ->
          console.log 'rest client @put error: ' + baseUrl + url
          reject err

    @delete = (url, args) ->
      setDefaultArgs args
      new Promise (resolve, reject) ->
        client.delete(baseUrl + url, args, (data, response) ->
          if parseInt(response.statusCode / 100) == 2 || parseInt(response.statusCode / 100) == 3
            response.body = data
            resolve(response)
          else
            response.body = data.toString();
            reject response
        ).on 'error', (err) ->
          console.log 'rest client @delete error: ' + baseUrl + url
          reject err

    @patch = (url, args) ->
      setDefaultArgs args
      new Promise (resolve, reject) ->
        client.patch(baseUrl + url, args, (data, response) ->
          if parseInt(response.statusCode / 100) == 2 || parseInt(response.statusCode / 100) == 3
            response.body = data
            resolve response
          else
            response.body = data.toString();
            reject response
        ).on 'error', (err) ->
          console.log 'rest client @patch error: ' + baseUrl + url
          reject err

module.exports = RestClient;
