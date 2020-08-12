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
class Permission extends Crud {
  static boot () {
    super.boot()
  }
  static get table(){
    return  'permission'
  }
  async fields(){
    let bq= this.baseQuery();
    let pidData=(await bq.select({
      id:'id',
      txt:'name'
    }).fetch()).rows
    pidData.unshift({
      id:'-1',
      txt:'全部'
    })
    let rs= [
      new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
      new TextField('名称','name').setUIConf(true,true,false,false,false).setDBConf(true,false,'required').check(),
      new TextField('编码','code').setUIConf(true,true,false,false,false).setDBConf(true,false,'required').check(),
      new SelectField('父编码','pid').setUIConf(false,true,false,false,false).setDBConf(true,false)
      .setData(pidData)
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
     gridConf.setTreeGrid('pid')
     gridConf.addBtn(
        new BaseBtn('更新权限树',BtnPosition.Table,"updatePermission",ActionType.API)
        .setUrl(null,null,'updatePermission').check()
      )
   }
}

module.exports = Permission
