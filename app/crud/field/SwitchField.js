const BaseField= require('./BaseField');
class SwitchField extends BaseField{
  /**
   * 是否开关字段
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
   */
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
