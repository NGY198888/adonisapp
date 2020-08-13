'use strict'

const Exceptions = require('@adonisjs/lucid/src/Exceptions');
const { forEach } = require('lodash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User=use('App/Models/User')
const {validate}=use('Validator')
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const Logger = use('Logger')
class UserController {
   async login({request,session,response,auth}){
    //  for (let index = 0; index < 1000; index++) {
    //   console.log(11111111111);

    //  }
    let data=request.only(['password', 'username']);
    const rules = {
        username: 'required',
        password: 'required'
      }
      const msgs={
        'username.required': '用户名未填写',
        'password.required': '密码未填写',
        // 'username.email': '用户名需要填写邮箱',
      };
      const validation = await validate(request.all(), rules,msgs)
      if (validation.fails()) {
        session
        .withErrors(validation.messages())
        .flashExcept(['password','username']);
        return response.status(422).send({
            message:validation.messages()
        });
    }
    try{
        let user=await User.findBy("username",data.username);
        if(!user){
            return response.status(422).send({message:"用户不存在"});
        }
        let token=await auth.attempt(data.username,data.password)
        Logger.info(`用户登录  ${user.username}`);
       return response.send(
        {
            user,
            token:token.token
        });
    }catch(err){
        console.log(err.message);
        return response.status(422).send({message:"密码错误"});
    }
    // console.log(auth);




   }
   async logout({request,session,response,auth}){
        let _user=''
        if(auth.user){
            _user="用户:"+auth.user.username
        }
         auth.logout();
         Logger.info(`用户登出  ${_user}`);
         response.redirect('/login')
   }
   async reg ({ request, response,session }) {
    let _model= User;
      const rules = {
        username: 'required|email|unique:users,username',
        password: 'required'
      }
      const msgs={
        'username.required': '用户名未填写',
        'username.unique': '用户名已存在',
        'password.required': '密码未填写',
        'username.email': '用户名需要填写邮箱',
      };
      console.log(request.all());
      let  data=request.only(['password', 'username'])
      const validation = await validate(request.all(), rules,msgs)

      if (validation.fails()) {
          return response.status(422).send({
            message:validation.messages()
        });
      }
      data.email=data.username
      let user=new _model();
      user=Object.assign(user,data);
      await user.save();
      return user;
   }
}

module.exports = UserController
