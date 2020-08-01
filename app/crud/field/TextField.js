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
  /**
   * 设置类型为文本域
   * @param {Number} rows 输入框行数
   */
  setTypeTextarea(rows){
    this.rows=rows||3
    return this._setType('textarea');
  }
  /** 设置类型为密码 */
  setTypePassword(){
    return this._setType('password');
  }
  /** 设置类型为数字 */
  setTypeNumber(){
    return this._setType('number');
  }
  _setType(type){
    this.type=type
    return this;
  }
}
module.exports=TextField;
