'use strict'
const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SelectField = require('../crud/field/SelectField');
const Table1ToNField = require('../crud/field/Table1ToNField');
const MultSelectField = require('../crud/field/MultSelectField');
const TabField = require('../crud/field/TabField');
const User=use('App/Models/User')
class Post extends Crud {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', 'PostHook.addAuthor')
    this.addHook('afterFind', 'PostHook.fethComments')
  }
    static get rule_msgs(){
        return {
            'title.required': '标题未填写',
            'content.required': '内容未填写',
            'title.unique': '标题重复',
        };
    }
    async fields(){
      let authorData=(await (new User()).baseQuery().select({
        id:'id',
        txt:'username'
      }).fetch()).rows
      let rs= [
        new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
        new TextField('标题','title').setUIConf(true,true,true,true,true).setDBConf(true,true,'required').check(),
        new TextField('正文','content').setUIConf(true,true,true,false,false).setDBConf(true,false,'required')
        .setTypeTextarea(5)
        .check(),
        new SelectField('作者','author').setUIConf(true,false,true,false,false).setDBConf(true,false)
        .setData(authorData)
        .check(),
        // new MultSelectField('评论列表','comments').setUIConf(false,true,false,false,false)
        // .setDBConf(true,false)
        // .setData(authorData)
        // .check(),
        new TabField('评论列表'),
        new Table1ToNField('评论列表','comments').setUIConf(false,true,false,false,false)
        .setDBConf(true,false)
        .hideLabel()
        // .setOwnTab()
        // .setData(authorData)
        .check(),
      ]
      return rs;
    }
    subTable(){
      return ['comments'];
    }
    comments(){
       return  this.hasMany('App/Models/Comment',"id","post_id")//这个写法是对的
    }
}

module.exports = Post
