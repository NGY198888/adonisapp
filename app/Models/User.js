'use strict'

const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const DateField = require('../crud/field/DateField');
const GridConf = require('../crud/conf/GridConf');
const BaseField = require('../crud/field/BaseField');
const BaseBtn = require('../crud/btn/BaseBtn');
const BtnPosition = require('../crud/btn/BtnPosition');
const ActionType = require('../crud/btn/ActionType');
class User extends Crud {
  static boot () {
    super.boot()
    this.addHook('beforeSave', 'UserHook.encryptionPwd')
    this.addHook('beforeSave', 'UserHook.addEmail')
  }
  static get delete_at(){
    return 'deleted_at';
  }
  static get hidden () {
    return ['password']
  }
 rule_msgs(){
    return {
        'username.required': '用户名未填写',
        'content.required': '内容未填写',
        'title.unique': '标题重复',
    };
 }
 fields(){
    return [
          new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
          new TextField('用户名','username').setUIConf(true,true,true,true,true).setVal("编辑的值").setDBConf(true,true,'required').check(),
          new TextField('邮箱','email').setUIConf(true,true,true,false,false).setDBConf(true,false).check(),
          new DateField('更新时间','updated_at').setUIConf(true,false,true,false,false).setDBConf(true,false).check(),
          new DateField('创建时间','created_at').setUIConf(true,false,true,false,false).setDBConf(true,false).check(),
        ]
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
    gridConf.addBtn(
      new BaseBtn('测试',BtnPosition.Table,null,ActionType.API).setUrl(null,null,'test').check()
    )
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

}
module.exports = User
