const BaseField= require('./BaseField');
class IconField extends BaseField{
/**
   * 图标选中字段
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
   */
  constructor(label, field = null){
    super(label, field)
    this.type="icon_select"
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=IconField;
