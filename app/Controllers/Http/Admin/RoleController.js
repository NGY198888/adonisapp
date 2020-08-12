'use strict'
const CrudController = require('./CrudController');
const TextField = require('../../../crud/field/TextField');
const TreeField = require('../../../crud/field/TreeField');
const Permission = require('../../../Models/Permission');
const _= require('lodash');
class RoleController  extends CrudController  {
  get resource(){
    return 'roles'
  }
  setPermissionForm= async({request, response })=>{
    const Database = use('Database')
    let ps=await Database.table('permission').select({
      id:'id',
      pid:'pid',
      name:'code'
    })
    let fields = [
      new TextField('名称','name')
      .setUIConf(true,true,false,false,false)
      .setDBConf(true,true,'required').check(),
      new TreeField('权限','permission_role').setUIConf(false,true,true,false,false)
      .setDBConf(true,false)
      .setData(ps)
      .check(),
    ];
    return {
        fields,
    }
  }
  setPermission= async({request, response })=>{
    let {form,id}= request.all()
     let role= await this.model.find(id)
     form['permission_role']=_.map( form['permission_role'],(id)=>{
        return {'permission_id':id}
     })
     role.merge(form)
     await role.save()
     return {message:'分配成功'}
  }
}
module.exports = RoleController
