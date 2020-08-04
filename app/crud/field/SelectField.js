const BaseField= require('./BaseField');
const { isArray, isFunction } = require('lodash');
class SelectField extends BaseField{
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
