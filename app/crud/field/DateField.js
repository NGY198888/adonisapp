const BaseField= require('./BaseField');
class DateField extends BaseField{
  /**
   * 日期时间字段
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
   */
  constructor(label, field = null){
    super(label, field)
    this.type="date"
  }
  /**
   * 设置类型
   * @param {['year','month','date','week','datetime','datetimerange','daterange','dates']} type 类型 默认date
   */
  setType(type){
    this.type=type
    return  this;
  }
  parseQuery(query,_model) {
    switch(this.type){

       default :
          query.whereRaw(`datediff(${this._field(_model)}, '${this.val}' )=0`);
          break
    }

    return this
  }
}
module.exports=DateField;
