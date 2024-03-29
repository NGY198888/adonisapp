'use strict'

const Exceptions = require('@adonisjs/lucid/src/Exceptions');
const { ModelException } = require('@adonisjs/lucid/src/Exceptions');
const _lodash = require('lodash');
const GridConf = require('../crud/conf/GridConf');
const BaseBtn = require('../crud/btn/BaseBtn');
const BaseField = require('../crud/field/BaseField');
const FieldTypeMap = require('../crud/field/FieldTypeMap');
// /** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
// const ErrCode=require('../ErrCode')

class Crud extends Model {
   static boot () {
        super.boot()
        this.addHook('beforeCreate', 'CrudHook.addID')
        this.addHook('beforeCreate', 'CrudHook.addDeleteAt')
        this.addHook('beforeSave', 'CrudHook.uniqueCheck')
        this.addHook('beforeCreate', 'CrudHook.createSubTable')
        this.addHook('afterCreate', 'CrudHook.createSubTable')
        this.addHook('beforeUpdate', 'CrudHook.updateSubTable')
        this.addHook('afterUpdate', 'CrudHook.updateSubTable')
        this.addHook('afterFind', 'CrudHook.fethSubTable')
        this.addHook('afterDelete', 'CrudHook.deleteSubTable')

   }

  async  rules(){
       let rules={};
        let fields= this._fields2ObjArr(await this.fields(),"validator")
        fields.forEach(field => {
          rules[field.field]=field.validator
        });
        return rules;
   }
   subTable(){
     return [];
   }
   validMap(){
    const obj= {
       'required':'未填写',
       'email':'必须是邮箱格式',
       'integer':'必须是整数',
       'range':'范围不对',
     };
     return obj;
   }
   async rule_msgs(){
       let _fields=await this.fields()
       let fields= this._fields2ObjArr(_fields,"validator")
       let rs={};
       fields.forEach(field => {
          if(field.validator){
           let  validators=field.validator.split('|')
           validators.forEach(valid => {
            rs[`${field.field}.${valid}`]=`${field.label}${this.validMap()[valid]}`
           });
          }
       });
       return rs;
   }
   //需要保存到数据库的字段
   async  saveFields(){
        return this._fields2arr(await this.fields(),"save");
   }
    _fields2arr(_fields,key) {
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
   async uniqueFields(){
       return this._fields2arr(await this.fields(),"unique");
   }
  async fields(){
//     return [
//         {field:'_id',label:'ID'},
//         {field:'title',label:'标题',type:'text',default:null,placeholder:"搜索标题",searchable: true,grid:true,form:true,view:true,save:true},
//         {field:'updated_at',label:'更新时间',type:'date',default:null,searchable: true,grid:true,view:true},
//         {field:'created_at',label:'创建时间',type:'date',default:null,searchable: true,grid:true,view:true},
//    ]
    throw new Error(this.name+' model未设置 fields 返回');
   }
   async   grid(permission=true){
       const _fields= await this.fields()
       let fields = this._fields2ObjArr(_fields,"grid");
       let formFields = this._fields2ObjArr(_fields,"form");
       let viewFields = this._fields2ObjArr(_fields,"view");
       let searchFields = this._fields2ObjArr(_fields,"searchable");
        searchFields.forEach(_field => {
          _field.val=_field.searchVal||null;
        });
       let gridConf= new GridConf(this.constructor.table,this.constructor.primaryKey)
       .setFields(fields,formFields,viewFields,searchFields);
       await this.onPagination(gridConf);
       await this.onAddCrudBtn(gridConf);
       await this.onGridConf(gridConf,fields,formFields,viewFields,searchFields);
       return await gridConf.check(permission);
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

   }
   /**
    * 设置分页
    * @param {GridConf} gridConf
    */
  async onPagination(gridConf){
     gridConf.setPagination(true)
   }
   /**
    * 添加默认按钮
    * @param {GridConf} gridConf
    */
  async onAddCrudBtn(gridConf){
    gridConf.addCrudBtn(true)
   }
   async form(){
       const _fields= await this.fields()
        let fields = this._fields2ObjArr(_fields,"form");
        return {
            fields,
        };
   }
   async exportFields(){
        const _fields= await this.fields()
        let fields = this._fields2ObjArr(_fields,"exportAble");
        return fields;
    }
    async importFields(){
      const _fields= await this.fields()
      let fields = this._fields2ObjArr(_fields,"importAble");
      return fields;
    }
    _fields2ObjArr(_fields,key) {
        const formFields = _lodash.filter(_fields, (_field) => {
            return !!_field[key];
        });
        let fields = [];
        formFields.forEach(_field => {
            fields.push(_lodash.cloneDeep(_field)) ;
        });
        return fields;
    }

    async view(){
        const _fields=  this.fields()
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
   /**表别名 */
   tableAlias(){
       return 'tableAlias';
   }
   /**获取表查询对象 */
   baseQuery(){
    let query = this.constructor.query()
     if(this.constructor.delete_at){
        query.whereNull(this.constructor.delete_at)
     }
    this.selectFrom(query)
    return query;
   }
   /**
    * 查询哪个表可自定义
    * @param {*} query
    */
   selectFrom(query){
     let obj={}
     obj[this.tableAlias()]=this.constructor.table
     query.from(obj)
   }
   /**
    * 查询字段可自定义
    * @param {*} query
    */
   selectFields(query){
      query.select(`${this.tableAlias()}.*`)
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
  /**
   * 获取查询对象后的回调
   * @param {*} query
   */
  async onQuery(query){
    //此处一般用来连表，之后可能需要重新 selectFields   select 要在Join语句后面
    //query.leftJoin({'p2':'pages'}, 'p2.id', 'p1.pid')
  }
  async parseQuery(request,paginate=true){
    let queryData= (request.all().query);
    queryData = JSON.parse(queryData|| "{}");
    const { page = 1, perPage = 10, sort = null, where = [] } = queryData;
    let query=  this.baseQuery();
    await this.onQuery(query)
    where.forEach(field => {
      if(field.val){
        let instance=null;

        try {
           let clazz=use(`App/crud/field/${FieldTypeMap[field.type]}`)
           instance=new clazz(field.label,field.field,field.val);
           instance=Object.assign(instance,field)
        } catch (error) {
           throw new Error(`类型 ${field.type}Field 不存在`);
        }
        try {
          instance.parseQuery(query,this)
        } catch (error) {
           throw new Error(`类型 ${field.type}Field parseQuery异常`);
        }

      }
    });
    sort&&(query.orderBy(...sort.split(' ')))
    this.selectFields(query)
    this.beforeQuery(query,queryData)
    let rows=null;
    if(paginate){
      rows= await query.paginate(page,perPage);
    }else{
      rows=await query.fetch();
    }
    this.afterQuery(rows)
    return rows
  }
  /**
   * 查询前的回调
   * @param {*} query 查询对象
   * @param {*} queryData 页面条件
   */
  beforeQuery(query,queryData){

  }
  /**
   * 查询后回调
   * @param {*} rows
   */
  afterQuery(rows){

  }
  /**
   * 批量删除
   * @param {*} ids
   */
  async deleteAll(ids){
    if(this.constructor.delete_at){
      let updateObj={};
      updateObj[this.constructor.delete_at]= new Date();
      await this.constructor.query().whereIn(this.constructor.primaryKey, ids).update(updateObj)
    }else{
      await this.constructor.query().whereIn(this.constructor.primaryKey, ids).delete()
    }
  }
}

module.exports = Crud
