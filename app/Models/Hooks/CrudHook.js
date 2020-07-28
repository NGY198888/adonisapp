'use strict'

const Exceptions = require("@adonisjs/lucid/src/Exceptions");
const UUID = require('uuid');
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
            let msg=_field+"已存在";
            const rule_msgs= modelInstance.constructor.rule_msgs
            const _key=_field+'.unique';
            if(rule_msgs&&rule_msgs.hasOwnProperty(_key)){
                msg=rule_msgs[_key]
            }
            throw new Error(msg)
        }
    }
    let uniqueFields= modelInstance.constructor.uniqueFields;
    if(uniqueFields&&uniqueFields.length>0){
       for (const key in uniqueFields) {
            const _field= uniqueFields[key]
            if(modelInstance.$persisted){
                const val=modelInstance[_field]
                 let qobj=  {}
                 qobj[_field]=val
                 qobj[modelInstance.constructor.primaryKey]={$ne:modelInstance.primaryKeyValue}
                let rs= await modelInstance.constructor.baseQuery.where(qobj).ignoreScopes().fetch()
                dealrs(modelInstance,rs,_field)
            }else{
                console.log(modelInstance);
                const val=modelInstance[_field]
                let rs= await modelInstance.constructor.baseQuery.where(_field,val).fetch()
                dealrs(modelInstance,rs,_field)
            }
       }
    }
}

