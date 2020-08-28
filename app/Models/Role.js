'use strict'
const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SelectField = require('../crud/field/SelectField');
const TabField = require('../crud/field/TabField');
const SwitchField = require('../crud/field/SwitchField');
const FileField = require('../crud/field/FileField');
const ImageField = require('../crud/field/ImageField');
const ColumnTpl = require('../crud/field/ColumnTpl');
const BtnPosition = require('../crud/btn/BtnPosition');
const ActionType = require('../crud/btn/ActionType');
const BaseBtn = require('../crud/btn/BaseBtn');
const TreeField = require('../crud/field/TreeField');
const { map } = require('lodash');
class Role extends Crud {
  static boot () {
    super.boot()
  }
  static get table(){
    return  'roles'
  }
  async fields(){
    const Database = use('Database')
    let ps=await Database.table('permission').select({
      id:'id',
      pid:'pid',
      name:'name'
    })
    let rs= [
      new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
      new TextField('名称','name').setUIConf(true,true,false,false,false).setDBConf(true,true,'required').check(),
      new TextField('编码','code').setUIConf(true,true,true,false,false).setDBConf(true,true,'required').check(),
      new TextField('描述','des').setUIConf(true,true,true,false,false).setDBConf(true,false)
      .setTypeTextarea(5)
      .check(),
      new SwitchField('启用','enabled').setUIConf(true,true,false,false,false).setDBConf(true,false)
      .setColumnTpl(ColumnTpl.Tag,{
          success:[1,"1","是"],
      })
      .setValDic(
      {
        '1':'是',
        '0':'否',
        'null':'否'
      })
      .setVal(1)
      .check(),
      new TreeField('权限','permission_role').setUIConf(false,true,true,false,false)
      .setDBConf(true,false)
      .setData(ps)
      .setOnGetVal((row)=>{
        row['permission_role']=map( row['permission_role'],(id)=>{
          return {'permission_id':id}
        })
      })
      .SetOnSetVal((row)=>{
        row['permission_role']= map(row['permission_role'],item=>item['permission_id'])
      })
      .check(),
    ]
    return rs;
  }
   /**
    * 自定义gird配置
    * @param {GridConf} gridConf
    * @param {Array<BaseField>} fields
    * @param {Array<BaseField>} formFields
    * @param {Array<BaseField>} viewFields
    * @param {Array<BaseField>} searchFields
    */
   async onGridConf(gridConf,fields,formFields,viewFields,searchFields){
    // gridConf.addBtn(
    //   new BaseBtn('分配权限',BtnPosition.Row,"setPermission",ActionType.FORM)
    //   .setUrl('setPermissionForm',null,'setPermission').check()
    // )
  }
 permission_role(){
  return  this.hasMany('App/Models/PermissionRole',"id","role_id")//这个写法是对的
 }
 subTable(){
  return ['permission_role'];
 }
}

module.exports = Role
