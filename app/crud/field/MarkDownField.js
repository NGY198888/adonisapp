
const BaseField= require('./BaseField');
class MarkDownField extends BaseField{
   /**
   * 文本输入字段
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
   */
  constructor(label, field = null){
    super(label, field)
    this.type="markdown"
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=MarkDownField;