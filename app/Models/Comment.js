'use strict'
const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SelectField = require('../crud/field/SelectField');
const BaseBtn = require('../crud/btn/BaseBtn');
const BtnPosition = require('../crud/btn/BtnPosition');
const ActionType = require('../crud/btn/ActionType');
const GridConf = require('../crud/conf/GridConf');
const User=use('App/Models/User')
class Comment extends Crud {
  static boot () {
    super.boot()
    // this.addHook('beforeCreate', 'PostHook.addAuthor')
  }
    static get rule_msgs(){
        return {
            'title.required': '标题未填写',
            'content.required': '内容未填写',
        };
    }
    async fields(){
      let authorData=(await (new User()).baseQuery().select({
        id:'id',
        txt:'username'
      }).fetch()).rows
      let rs= [
        new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
        new TextField('标题','title').setUIConf(true,true,true,true,true).setDBConf(true,false,'required').check(),
        new TextField('正文','content').setUIConf(true,true,true,false,false).setDBConf(true,false,'required')
        .setTypeTextarea(5)
        .check(),
        new SelectField('评论人','user_id').setUIConf(true,false,true,false,false).setDBConf(true,false)
        .setData(authorData)
        .check()
      ]
      return rs;
    }
    post(){
      return  this.belongsTo('App/Models/Post','post_id','id')
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
        new BaseBtn('非常规方法',BtnPosition.Table,"test",ActionType.API).setUrl(null,null,'test').check()
      )
    }
}
module.exports = Comment
