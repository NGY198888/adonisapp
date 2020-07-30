'use strict'

const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const DateField = require('../crud/field/DateField');
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
