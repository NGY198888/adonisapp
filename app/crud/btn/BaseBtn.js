const BtnPosition = require("./BtnPosition");
const ActionType = require("./ActionType");
const ColorType = require("./ColorType");
class BaseBtn {
  constructor(name,position,action,actionType){
    BtnPosition.check(position);
    ActionType.check(actionType);
    this.position=position//位置，表格上或者行内

    this.name=name//按钮名称
    this.action=action//默认的action，系统默认使用action，优先级低于url
    this.actionType=actionType//按钮的类型  弹窗提交表单或者只是调用api
    this.confirmTips=null;//按钮触发前确认信息
    this.icon=null
    this.color=null;//预留
    this.ui_url=null//表单显示字段接口
    this.data_url=null//表单数据充填接口 默认是拿选中行数据
    this.commit_url=null//提交处理表单接口
    this.form_title=name;
    this.form_height=600
    this.form_width='50%'
    this.needSelect=position==BtnPosition.Table?false:true//是否依赖选中行

  }
  /**
   * 设置弹窗属性
   * @param {Number} height 高 默认600
   * @param {String} width  宽  '500px'|'50%'|'50vw' 默认'50%'
   */
  setFormAttr(height=600,width='50%',title=null){
    this.form_height=height
    this.form_width=width
    this.form_title=title||this.form_title
    return this
  }
 /**
  * 设置url
  * @param {String} ui_url 表单显示字段接口
  * @param {string} data_url 数据源接口
  * @param {string} commit_url 提交接口
  */
  setUrl(ui_url=null,data_url=null,commit_url=null){
     this.ui_url=ui_url
     this.data_url=data_url
     this.commit_url=commit_url
     return this
  }
   /**
    * 设置UI属性
    * @param {String} icon 按钮图标  尚不支持
    * @param {String} color 按钮颜色 尚不支持
    */
  setUI(icon=null,color=ColorType.info){
    this.icon=icon
    this.color=color
    return this
  }
  /**
   * 设置确认提示文本
   * @param {string} confirmTips 提示文本
   */
  setConfirmTips(confirmTips){
    this.confirmTips=confirmTips
    return this
  }
  /**检查按钮配置 */
  check(){

    return this;
  }

}
module.exports=BaseBtn;
