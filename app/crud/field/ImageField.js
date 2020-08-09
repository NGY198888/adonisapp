const FileField= require('./FileField');
class ImageField extends FileField{

  /**
   * 图片上传控件
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性名
   */
  constructor(label, field){
    super(label, field)
    this.type="image"
    this.fileType=['image/png','image/jpeg']
  }

}
module.exports=ImageField;
