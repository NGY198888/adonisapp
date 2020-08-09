const BaseField= require('./BaseField');
class Table1ToNField extends BaseField{
  /**
   * 一对多子表
   * @param {*} label  标签
   * @param {*} field  资源名
   */
  constructor(label, field = null){
    super(label, field)
    this.type="table_1_to_n"
    this.resource=field;
    this.height=390;
    this.val=[];
  }
  parseQuery(query,_model) {
    return this
  }
}
module.exports=Table1ToNField;
