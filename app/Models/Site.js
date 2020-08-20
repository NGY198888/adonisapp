'use strict'
const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SelectField = require('../crud/field/SelectField');
const TabField = require('../crud/field/TabField');
const SwitchField = require('../crud/field/SwitchField');
const FileField = require('../crud/field/FileField');
const ImageField = require('../crud/field/ImageField');
const MarkDownField = require('../crud/field/MarkDownField');
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
      new MarkDownField('描述','des').setUIConf(true,true,true,false,false).setDBConf(true,false,'required')
      // .setTypeTextarea(5)
      .check(),
      new SwitchField('展开侧边栏','open_side_bar').setUIConf(true,true,false,false,false).setDBConf(true,false)
      .check(),
      new SelectField('语言','lang').setUIConf(true,true,false,false,false).setDBConf(true,false)
      .setData([
        {
          id:'zh',
          txt:'中文'
        },
        {
          id:'en',
          txt:'en'
        }
      ])
      .check(),
     new SwitchField('编辑面板提示','form_confirm').setUIConf(true,true,false,false,false).setDBConf(true,false)
     .check(),
    //  new ImageField('logo','logo').setUIConf(true,true,false,false,false).setDBConf(true,false)
    //  .check(),
    ]
    return rs;
  }
}

module.exports = Site
