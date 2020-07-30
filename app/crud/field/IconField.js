const BaseField= require('./BaseField');
class IconField extends BaseField{

  constructor(label, field = null){
    super(label, field)
    this.type="icon_select"
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=IconField;
