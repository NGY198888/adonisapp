const BaseField= require('./BaseField');
class MultSelectField extends BaseField{
   /**
   * 多选下拉框
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
   */
  constructor(label, field = null){
    super(label, field)
    this.type="mult_select"
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=MultSelectField;
