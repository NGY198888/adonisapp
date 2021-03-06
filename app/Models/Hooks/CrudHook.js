'use strict'

const Exceptions = require("@adonisjs/lucid/src/Exceptions");
const UUID = require('uuid');
const { unset } = require("lodash");
const CrudHook = exports = module.exports = {}

CrudHook.addDeleteAt = async (modelInstance) => {
    if(modelInstance.constructor.delete_at){
        modelInstance[modelInstance.constructor.delete_at]=null;
    }
}
CrudHook.addID = async (modelInstance) => {
  if(!modelInstance.primaryKeyValue){
    modelInstance.primaryKeyValue=UUID.v4();
  }
}

CrudHook.uniqueCheck = async (modelInstance) => {
    //判断某个字段的值在该表是否重复
    const dealrs=(modelInstance,rs,_field)=>{
        if(rs.rows.length>0)
        {
            let msg=modelInstance[_field]+"已存在";
            const rule_msgs= modelInstance.rule_msgs()
            const _key=_field+'.unique';
            if(rule_msgs&&rule_msgs.hasOwnProperty(_key)){
                msg=rule_msgs[_key]
            }
            throw new Error(msg)
        }
    }
    let uniqueFields=await modelInstance.uniqueFields();
    if(uniqueFields&&uniqueFields.length>0){
       for (const key in uniqueFields) {
            const _field= uniqueFields[key]
            let qb= modelInstance.baseQuery()
            if(modelInstance.$persisted){
                const val=modelInstance[_field]
                //  let qobj=  {}  这是mongodb写法
                //  qobj[_field]=val
                //  qobj[modelInstance.constructor.primaryKey]={$ne:modelInstance.primaryKeyValue}
                // let rs= await qb.where(qobj).ignoreScopes().fetch()
                let rs= await qb.where(_field,val).whereNot(modelInstance.constructor.primaryKey,modelInstance.primaryKeyValue).fetch()
                dealrs(modelInstance,rs,_field)
            }else{
                // console.log(modelInstance);
                const val=modelInstance[_field]
                // let rs= await modelInstance.constructor.baseQuery.where(_field,val).fetch()
                let rs= await qb.where(_field,val).fetch()
                dealrs(modelInstance,rs,_field)
            }
       }
    }
}
CrudHook.createSubTable= async (modelInstance) => {
  let map={}
  if(global.request[`sub_table_map_${modelInstance.constructor.table}`]){
      map=global.request[`sub_table_map_${modelInstance.constructor.table}`]
      for (const sub in map) {
        //  let sub_rows_db= modelInstance.getRelated(sub)
        let sub_rows= map[sub]
        let sub_model =modelInstance[sub]()
        await sub_model.createMany(sub_rows)
      }
  }else{
      let subTable=  modelInstance.subTable();
     subTable.forEach(sub => {
      let sub_rows= modelInstance.$attributes[sub]
      if(sub_rows){
        map[sub]=sub_rows
      }
      unset(modelInstance.$attributes,sub)
    });
    global.request[`sub_table_map_${modelInstance.constructor.table}`]=map;
  }
}
CrudHook.updateSubTable= async (modelInstance) => {
  let map={}
  if(global.request[`sub_table_map_${modelInstance.constructor.table}`]){
      map=global.request[`sub_table_map_${modelInstance.constructor.table}`]
      for (const sub in map) {
        //  let sub_rows_db= modelInstance.getRelated(sub)
        let sub_rows= map[sub]
        let sub_model =modelInstance[sub]()
        await sub_model.delete()
        await sub_model.createMany(sub_rows)
      }
  }else{
      let subTable=  modelInstance.subTable();
     subTable.forEach(sub => {
      let sub_rows= modelInstance.$attributes[sub]
      if(sub_rows){
        map[sub]=sub_rows
      }
      unset(modelInstance.$attributes,sub)
    });
    global.request[`sub_table_map_${modelInstance.constructor.table}`]=map;
  }
}

CrudHook.fethSubTable=async (modelInstance) => {
  let subTable = modelInstance.subTable();
  // lodash的forEach和[].forEach不支持await,如果非要一边遍历一边执行await,可使用for-of
  // await subTable.forEach(async (sub) => {
  // });
  for (const sub of subTable) {
    await modelInstance.load(sub);
  }
}
CrudHook.deleteSubTable=async (modelInstance) => {
  let subTable=  modelInstance.subTable();
  subTable.forEach(async sub => {
    await modelInstance.load(sub);
    const sub_rows = modelInstance.getRelated(sub)
    sub_rows.delete();
  });

}
