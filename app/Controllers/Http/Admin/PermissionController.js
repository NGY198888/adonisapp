'use strict'
const CrudController = require('./CrudController');
const TextField = require('../../../crud/field/TextField');
const TreeField = require('../../../crud/field/TreeField');
const Permission = require('../../../Models/Permission');
const _= require('lodash');
var inflection = require( 'inflection' );
const UUID = require('uuid');
const { unionBy } = require('lodash');
class PermissionController  extends CrudController  {
  get resource(){
    return 'permissions'
  }

  updatePermission= async({request, response })=>{
     const Database = use('Database')
     let pages= await Database.table('pages').select();
     let rs= await Database.table('permission as p').select();
     let map={};
     rs.forEach(p => {
        map[`${p['code']}|${p['pid']}`]=p;
     });
     for (const p of pages) {
      let data={
        code:p['code'],
        name:p['name'],
        pid:p['pid']||'-1',
        id:p['id'],
      }
      let model_instance =await Permission.find(data['id'])
      if(!model_instance){
        model_instance=new Permission();
      }
      model_instance=Object.assign(model_instance,data);
      await  model_instance.save();
      if(p['url']){
        let _resource =inflection.classify( p['code'])
        try {
          const model = use('App/Models/' +_resource)
          let conf =await new model().grid()
          let btns= conf.getBtns();
          btns=unionBy(btns,'action');
          for (const btn of btns) {
            let action= btn.getAction()
            let data={
              code:action,
              pid:p['id'],
              name:btn['name'],
            }
            if(Object.prototype.hasOwnProperty.call(map, `${data['code']}|${data['pid']}`)){
               data['id']=map[`${data['code']}|${data['pid']}`].id
            }else{
              data['id']=UUID.v4()
            }
            let model_instance2 =await Permission.find(data['id'])
            if(!model_instance2){
              model_instance2=new Permission();
            }
            model_instance2=Object.assign(model_instance2,data);
            await model_instance2.save();
          }
        } catch (error) {}
      }
     }
     return {message:'更新成功'}
  }
}
module.exports = PermissionController
