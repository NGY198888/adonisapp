const BaseField= require('./BaseField');
class SwitchField extends BaseField{
  constructor(label, field = null){
    super(label, field)
    this.type="switch"
  }
  parseQuery(query,_model) {
    if(this.val){
      query.where(this._field(_model), 1)
    }else{
      query.whereNull(this._field(_model)).orWhere(this._field(_model), 0);
    }
    return this
  }
}
module.exports=SwitchField;
