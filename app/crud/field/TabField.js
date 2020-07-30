const BaseField= require('./BaseField');

class TabField extends BaseField{
/**
 * 会在编辑面板显示一个tab，把后面的字段划分到自己的空间里，到下一个TabField为止
 */
  constructor(label, field = null){
    super(label, field)
    this.type="tab"
    this.form = true;
    this.view = true;
    this.save = false;
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=TabField;
