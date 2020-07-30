const BaseField= require('./BaseField');
const { isArray, isFunction } = require('lodash');
const Page = require('../../Models/Page');
class SelectField extends BaseField{
  constructor(label, field = null){
    super(label, field)
    this.type="select"
    this.data=[];
  }
  parseQuery(query,_model) {
    query.where(this._field(_model), this.val)
    return this
  }
  /**
   * 设置待选数据
   * @param {[array,Function,Promise]} data
   */
   setData(data=[]){
    this.data=data
    return this;
  }
}
module.exports=SelectField;