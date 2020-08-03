const BaseField= require('./BaseField');
class MultSelectField extends BaseField{
  constructor(label, field = null){
    super(label, field)
    this.type="mult_select"
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=MultSelectField;
