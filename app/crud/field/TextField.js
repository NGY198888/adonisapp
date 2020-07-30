const BaseField= require('./BaseField');
class TextField extends BaseField{

  constructor(label, field = null){
    super(label, field)
    this.type="text"
  }
  parseQuery(query,_model) {
    query.where(this._field(_model),'like', `%${this.val}%`);
    return this
  }
}
module.exports=TextField;
