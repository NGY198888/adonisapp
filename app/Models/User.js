'use strict'

const Crud=require('./Crud');
class User extends Crud {
  static boot () {
    super.boot()
    this.addHook('beforeSave', 'UserHook.encryptionPwd')
    this.addHook('beforeSave', 'UserHook.addEmail')
  }
  static get hidden () {
    return ['password']
  }
  static get grid(){
    return {
      fields:{
        _id:{label:'ID'},
        username:{label:'用户名'},
        updated_at:{label:'更新时间',type:'datetime'},
        created_at:{label:'创建时间',type:'datetime'},
      }
    }
  }
  static get form(){
    return {
        fields:{
          username:{label:'用户名'},
          password:{label:'密码'},
        }
    }
  }
  static get view(){
    return {
      fields:{
        username:{label:'用户名'},
        updated_at:{label:'更新时间',type:'datetime'},
        created_at:{label:'创建时间',type:'datetime'},
      }
    }
  }
  static get saveFields(){
    return ['username','password'];
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
