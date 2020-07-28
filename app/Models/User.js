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
  static get rule_msgs(){
    return {
        'title.required': '标题未填写',
        'content.required': '内容未填写',
        'title.unique': '标题重复',
    };
 }
  static get fields(){
    return [
          new TextField('_id','id').setUIConf(true,true,true,false,false).setDBConf(true,true,'required').check(),
          new TextField('用户名','username').setUIConf(true,true,true,true,true).setVal("编辑的值").setDBConf(true,true,'required').check(),
          new TextField('邮箱','email').setUIConf(true,true,true,false,false).setDBConf(true,true,'required').check(),
          new DateField('更新时间','updated_at').setUIConf(true,true,true,false,false).setDBConf(true,false,'required').check(),
          new DateField('创建时间','created_at').setUIConf(true,true,true,false,false).setDBConf(true,false,'required').check(),
        ]
  }


  // static get delete_at(){
  //   return 'delete_at';
  // }

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
