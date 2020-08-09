const BaseField= require('./BaseField');
const { isArray, isFunction } = require('lodash');
class SelectField extends BaseField{
  /**
   * 单选下拉框
   * @param {*} label
   * @param {*} field
   */
  constructor(label, field = null){
    super(label, field)
    this.type="select"
  }
  parseQuery(query,_model) {
    query.where(this._field(_model), this.val)
    return this
  }
}
module.exports=SelectField;
