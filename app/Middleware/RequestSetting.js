'use strict'
const Logger = use('Logger')
class RequestSetting {
  async handle ({ request,auth,response }, next) {
   try {
      let loged=false
      let _user=''
      if(auth.user){
        loged=true
        _user="用户:"+auth.user.username
      }
      Logger.info(`请求 url:${request.url()}  ${loged?"已登录":"未登录"} ${_user} `);
   } catch (error) {
     
   }
    
    global.request=request;
    await next()
    try {
       if(response.response&&response.response.statusCode>=400){
        Logger.info(`业务异常 url:${request.url()}  response异常: ${response.response.statusCode} ${JSON.stringify(response._lazyBody.content)}`);
       }
    } catch (error) {
      
    }
   
  }
}

module.exports = RequestSetting