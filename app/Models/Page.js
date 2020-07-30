'use strict'

const Crud=require('./Crud');
const TextField = require('../crud/field/TextField');
const SwitchField = require('../crud/field/SwitchField');
const SelectField = require('../crud/field/SelectField');
const ColumnTpl = require('../crud/field/ColumnTpl');

class Page extends Crud {
    static boot () {
      super.boot()
      this.addHook('beforeUpdate', 'PageHook.checkPidIsSelf')
    }
    static get rule_msgs(){
        return {
            'name.required': '页面名称未填写',
            'url.required': '页面地址未填写',
            'name.unique': '页面名称重复',
        };
    }
    async fields(){
        let bq= this.baseQuery();
        let pidData=(await bq.where('isMenu',1).select({
          id:'id',
          txt:'name'
        }).fetch()).rows

        let rs= [
          new TextField('_id','id').setUIConf(false,false,false,false,false).setDBConf(true,false).check(),
          new TextField('页面名称','name').setUIConf(true,true,true,true,true).setDBConf(true,true,'required').check(),
          new TextField('页面地址','url').setUIConf(true,true,true,true,true).setDBConf(true,true,'required').check(),
          new TextField('图标','icon').setUIConf(true,true,true,true,true).setDBConf(true,false).check(),
          new SwitchField('是否菜单','isMenu').setUIConf(true,true,true,false,false).setDBConf(true,false)
          .setColumnTpl(ColumnTpl.Tag,{
              success:[1,"1","是"],
          })
          .check(),
          new TextField('父级菜单','pname').setUIConf(true,false,true,false,false).setDBConf(true,false)
          .check(),
          new SelectField('父级菜单','pid').setUIConf(false,true,false,false,false).setDBConf(true,false)
          .setData(pidData)
          .check()
        ]
        return rs;

    }
    async onQuery(query){
      //  let data= await this.baseQuery().db.from({'p1':'pages'}).leftJoin({'p2':'pages'}, 'p2.id', 'p1.pid').select('p1.*',{
      //   'pname':'p2.name'
      // });
      //select 要在Join语句后面
        query.leftJoin({'p2':'pages'}, 'p2.id', 'p1.pid')
        // .select('p1.*',{
        //   'pname':'p2.name'
        // });
    }
    tableAlias(){
      return 'p1';
    }
    // selectForm(query){
    //   query.from(this.constructor.table)
    // }
    selectFields(query){
       query.select('p1.*',{
        'pname':'p2.name'
      })
    }
    Pages(){
      return this.hasOne('App/Models/Page','id','pid')
    }

}

module.exports = Page
