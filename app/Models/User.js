'use strict'

const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const DateField = require('../crud/field/DateField');
const GridConf = require('../crud/conf/GridConf');
const BaseField = require('../crud/field/BaseField');
const BaseBtn = require('../crud/btn/BaseBtn');
const BtnPosition = require('../crud/btn/BtnPosition');
const ActionType = require('../crud/btn/ActionType');
const MultSelectField = require('../crud/field/MultSelectField');
const { map } = require('lodash');
const BtnAction = require('../crud/btn/BtnAction');
const Database = use('Database')
class User extends Crud {
  static boot () {
    super.boot()
    // this.addHook('beforeSave', 'UserHook.encryptionPwd')
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
 async fields(){
  const Database = use('Database')
  let roles=await Database.table('roles').select({
    id:'id',
    txt:'name'
  })
    return [
          new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
          new TextField('用户名','username').setUIConf(true,true,true,true,true).setVal("编辑的值").setDBConf(true,true,'required').check(),
          // new TextField('邮箱','email').setUIConf(true,true,true,false,false).setDBConf(true,false).check(),
          new MultSelectField('角色','role_user').setUIConf(false,true,true,false,false)
          .setData(roles)
          .setOnGetVal((row)=>{
            row['role_user']=map( row['role_user'],(id)=>{
              return {'role_id':id}
            })
          })
          .SetOnSetVal((row)=>{
            row['role_user']= map(row['role_user'],item=>item['role_id'])
          })
          .setDBConf(true,false).check(),
          new DateField('更新时间','updated_at').setUIConf(true,false,true,false,false).setDBConf(true,false).check(),
          new DateField('创建时间','created_at').setUIConf(true,false,true,true,true).setDBConf(true,false).check(),
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
    // gridConf.addBtn(
    //  // new BaseBtn('测试',BtnPosition.Table,'Test',ActionType.API).setUrl(null,null,'test').check(),
    //   new BaseBtn('导出所有',BtnPosition.Table,BtnAction.Export,ActionType.API).check()
    // )
    gridConf.addXlsBtn();
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
  role_user(){
    return  this.hasMany('App/Models/RoleUser',"id","user_id")//这个写法是对的
   }
  subTable(){
    return ['role_user'];
  }

  basePermissionSql(uid){
    const Database = use('Database')
    let base=Database
    .table('permission as p')
    .joinRaw("left join permission as p2 on p.path  like concat(p2.path,'%') ")
    .distinct()
    if(uid=="0"){
      return base
    }
    return  base
    .innerJoin('permission_role as pr', 'pr.permission_id', 'p.id')
    .innerJoin('role_user as ru', 'pr.role_id', 'ru.role_id')
    .where('user_id',uid)
  }
  permissionSql(uid){
    return this.basePermissionSql(uid)
    .select("p2.*")
    .orderBy('p2.path')
  }
  pageSql(uid){
    return this.basePermissionSql(uid)
    .innerJoin('pages',function() {
      this.on('pages.code', '=', 'p.code').orOn('pages.code', '=', 'p2.code')
    })
    .select("pages.*")
    .orderBy('pages.sort')
  }

}
module.exports = User
