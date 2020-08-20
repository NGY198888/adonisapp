'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User=use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const CrudController = require("./CrudController");
const TextField = require('../../../crud/field/TextField');

class UserController  extends CrudController{
  get resource(){
    return 'users'
  }
  async  beforeAdd(model_instance){
    model_instance.password=await Hash.make(model_instance.password||'123456')
  }
  async formView({ params, request, response }){
    console.log('进入user formView');
    let _model=new this.model();
  let fields=  [
      new TextField('用户名','username').setUIConf(true,true,true,false,false).setDBConf(true,true,'required').check(),
      new TextField('密码','password').setUIConf(false,true,false,false,false)
      .setTypePassword()
      .setDBConf(true,false,'required').check(),
      new TextField('确认密码','password2').setUIConf(false,true,false,false,false)
      .setTypePassword()
      .setDBConf(false,false,'required').check(),
    ]
    return {
      fields,
      row:global.request._user,
    }
  }
  async formViewSave({ params, request, response }){
    console.log('进入user formViewSave');
    let row=global.request._user
    const rules = {
      username: 'required',
      password: 'required'
    }
    const msgs={
      'username.required': '用户名未填写',
      'password.required': '密码未填写',
    };
    let  password2=request.all()['password2']
    let  data=request.only(['password', 'username'])
    if(password2!=data['password']){
        throw new Error("密码不一致")
    }
    const validation = await validate(request.all(), rules,msgs)

    if (validation.fails()) {
        return response.status(422).send({
          message:validation.messages()
      });
    }
    data.password= await Hash.make(data.password)
    data.email=data.username
    row.merge(data);
    await row.save();
    return  {message:'success'};
  }
  //这是一个自定义按钮的提交接口
  test=async({request, response })=>{
       let {row,id,ids,where}=  request.all();
       console.log(row,id,ids,where);
      let rs=  await new this.model().baseQuery().fetch()
      return rs
  }


}

module.exports = UserController
