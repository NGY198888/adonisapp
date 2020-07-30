const BaseField= require('./BaseField');
class DateField extends BaseField{
  constructor(label, field = null){
    super(label, field)
    this.type="date"
  }

  parseQuery(query,_model) {
    query.whereRaw(`datediff(${this._field(_model)}, '${this.val}' )=0`);
    return this
  }
}
module.exports=DateField;
