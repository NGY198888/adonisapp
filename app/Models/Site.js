'use strict'
const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SelectField = require('../crud/field/SelectField');
const TabField = require('../crud/field/TabField');
const SwitchField = require('../crud/field/SwitchField');
class Site extends Crud {
  static boot () {
    super.boot()
  }
  static get table(){
    return  'site'
  }
  async fields(){
    let rs= [
      new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
      new TextField('网站名称','name').setUIConf(true,true,false,false,false).setDBConf(true,true,'required').check(),
      new TextField('描述','des').setUIConf(true,true,true,false,false).setDBConf(true,false,'required')
      .setTypeTextarea(5)
      .check(),
      new SwitchField('展开侧边栏','open_side_bar').setUIConf(true,true,false,false,false).setDBConf(true,false)
      .check(),
    ]
    return rs;
  }
}

module.exports = Site
