const BaseField= require('./BaseField');
const Env = use('Env')
class FileField extends BaseField{

  /**
   * 文件上传控件
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性名
   */
  constructor(label, field){
    super(label, field)
    this.type="file"
  }
  /**
   * 取值的钩子
   * @param {*} data
   */
  onGetVal(data){
    data[this.field]=data[this.field].path
  }
  /**
   * 设置值的钩子
   * @param {*} row
   */
  onSetVal(row){
    row[this.field]={
      path:row[this.field],
      url:`${Env.get('APP_URL')}/${row[this.field]}`,
      name:row[this.field],
    }
  }
}
module.exports=FileField;
