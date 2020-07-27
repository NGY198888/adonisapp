'use strict'

const Exceptions = require('@adonisjs/lucid/src/Exceptions');
const { ModelException } = require('@adonisjs/lucid/src/Exceptions');
const _lodash = require('lodash');
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
// const ErrCode=require('../ErrCode')

class Crud extends Model {
   static boot () {
        super.boot()
        this.addHook('beforeCreate', 'CrudHook.addDeleteAt')
        this.addHook('beforeSave', 'CrudHook.uniqueCheck')
   }
   static get rules(){
       let rules={};
        let fields= this._fields2ObjArr( this.fields,"validator")
        for (const key in fields) {
            if (fields.hasOwnProperty(key)) {
                const field = fields[key];
                rules[key]=field['validator']
            }
        }
        return rules;
   }
   static get rule_msgs(){
       return {};
   }
   //需要保存到数据库的字段
   static get saveFields(){
        return this._fields2arr(this.fields,"save");
   }
    static _fields2arr(_fields,key) {
        const saveFields = _lodash.filter(_fields, (_field) => {
            return !!_field[key];
        });
        let fields = [];
        saveFields.forEach(_field => {
            fields.push(_field.field);
        });
        return fields;
    }
   //不能重复的字段
   static get uniqueFields(){
       return this._fields2arr(this.fields,"unique");
   }
   static get fields(){
//     return [
//         {field:'_id',label:'ID'},
//         {field:'title',label:'标题',type:'text',default:null,placeholder:"搜索标题",searchable: true,grid:true,form:true,view:true,save:true},
//         {field:'updated_at',label:'更新时间',type:'date',default:null,searchable: true,grid:true,view:true},
//         {field:'created_at',label:'创建时间',type:'date',default:null,searchable: true,grid:true,view:true},
//    ]
    throw new Error(this.name+' model未设置 fields 返回');
   }
   static get grid(){
       const _fields=  this.fields
       let fields = this._fields2ObjArr(_fields,"grid");
       let searchFields = this._fields2ObjArr(_fields,"searchable");
       let searchModel={}
       const searchableFields= _lodash.filter(_fields, (_field)=>{
          return !!_field.searchable
       });
       searchableFields.forEach(_field => {
           if(_field.default!=undefined&&_field.default!=null){
             searchModel[_field.field]=_field.default
           }
       });
       return {
          fields,
          searchFields,
          searchModel
       };
   }
   static get form(){
        let fields = this._fields2ObjArr(this.fields,"form");
        return {
            fields,
        };
   }
   static  _fields2ObjArr(_fields,key) {
        const formFields = _lodash.filter(_fields, (_field) => {
            return !!_field[key];
        });
        let fields = [];
        formFields.forEach(_field => {
            fields.push(_field) ;
        });
        return fields;
    }

   static get  view(){
        const _fields=  this.fields
        const ViewFields= _lodash.filter(_fields, (_field)=>{
        return !!_field.view
        });
        let fields={};
        ViewFields.forEach(_field => {
          fields.push(_field) ;
        });
        return {
            fields,
        };
   }
   /**作废字段，默认没有作废字段 */
   static get delete_at(){
       return null;
   }
   static get baseQuery(){
    const query = this.query()
     if(this.delete_at){
        let qObj={};
        let v=[null];
       console.log( _lodash.isArray(v),v);
        // qObj["delete_at"]={"$in":v, "$exists":true}
        // qObj["delete_at"]={$ne:null}
        return query.where(qObj)
     }else{
        return query;
     }

   }
   static get incrementing () {
    return false
  }
  static get dates() {
      if(this.delete_at)
       {
           return super.dates.concat([this.delete_at])
       }else{
           return super.dates;
       }
  }
   /**
   *重写删除，实现软删除
   * @method delete
   * @async
   *
   * @return {Boolean}
   */
  async delete (trx) {
      try {
        await this.constructor.$hooks.before.exec('delete', this)
        const query = this.constructor.query().where(this.constructor.primaryKey, this.primaryKeyValue).ignoreScopes()
        if(this.constructor.delete_at){
            if (trx) { query.transacting(trx)  }
            let updateObj={}
            updateObj[this.constructor.delete_at]=this._getSetterValue(this.constructor.delete_at, new Date());
            let  affected = await query.update(updateObj)
            if (affected > 0) {
                this.freeze()
            }
            return !!affected
        }else{
            const response = await query.delete()
            if (response.result.n > 0) {
                this.freeze()
            }
            await this.constructor.$hooks.after.exec('delete', this)
            return !!response.result.ok
        }

      } catch (error) {
          throw error;
      }

  }

}

module.exports = Crud
