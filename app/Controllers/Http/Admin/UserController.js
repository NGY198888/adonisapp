'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User=use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const CrudController = require("./CrudController")

class UserController  extends CrudController{

  get resource(){
    return 'users'
  }
  async formView({ params, request, response }){
    console.log('进入user formView');
    let _model=new this.model();
    let _form=await _model.form()
    return {
      fields:_form.fields,
      row:global.request._user,
    }
  }
  async formViewSave({ params, request, response }){
    console.log('进入user formViewSave');
    let row=global.request._user
    let data =await this.getData(request, row,'Edit');
    await this.validate(response,request,row);
    row.merge(data);
    await row.save();
    return  {message:'success'};
  }

}

module.exports = UserController
