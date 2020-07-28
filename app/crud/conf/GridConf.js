const _ = require('lodash');
const BaseBtn = require("../btn/BaseBtn");
const BtnAction = require("../btn/BtnAction");
const BaseField = require("../field/BaseField");
const ActionType = require('../btn/ActionType');
const BtnPosition = require('../btn/BtnPosition');
class GridConf {
  /**
   * 表格配置
   * @param {*} table 表名
   * @param {*} sortStr 排序字符串， 比如'age desc'
   * @param {*} multCheck 是否支持多选
   */
  constructor(table,sortStr=null,multCheck=false){
    this.table=table
    this.sortStr=sortStr
    this.multCheck=multCheck
    this.tableSearchFields=[]
    this.tableFields=[]
    this.formFields=[]
    this.viewFields=[]
    this.buttons=[]
    this.pagination=true//是否分页，目前不支持不分页
    this.page=1
    this.total=0
    this.pageSize=20
    this.pageSizes=[20,40,100,500,100000]
  }
  /**
   * 分页配置
   * @param {Boolean} pagination 是否开启分页
   * @param {Number} pageSize   当前分页大小
   * @param {Int32Array} pageSizes  可选分页大小
   */
  setPagination(pagination,pageSize=20,pageSizes=[20,40,100,500,100000]){
    this.pagination=!!pagination
    this.pageSize=pageSize
    this.pageSizes=pageSizes
    return this;
  }
  /**
   * 设置字段
   * @param {Array<BaseField>} tableFields 表格列字段
   * @param {Array<BaseField>} formFields 编辑面板字段
   * @param {Array<BaseField>} viewFields 显示面板字段
   * @param {Array<BaseField>} tableSearchFields  搜索字段
   * @returns GridConf
   */
  setFields(tableFields,formFields,viewFields,tableSearchFields=[]){
     this.tableFields=tableFields
     this.formFields=formFields
     this.viewFields=viewFields
     this.tableSearchFields=tableSearchFields
     return this
  }
  /**
   * 添加按钮
   * @param {[BaseBtn,Array<BaseBtn>]} btn 按钮或按钮数组
   * @returns GridConf
   */
  addBtn(btn){
    if(_.isArray(btn)){
      this.buttons=_.concat(this.buttons, btns)
    }else{
      this.buttons.push(btn);
    }
    //根据name去重
    this.buttons= _.uniqBy(this.buttons,"name")
    return this
  }
  /**
   * 添加增删改按钮
   */
  addCrudBtn(){
      this.addBtn(new BaseBtn('新建',BtnPosition.Table,BtnAction.Add,ActionType.FORM))
          .addBtn(new BaseBtn('编辑',BtnPosition.Row,BtnAction.Edit,ActionType.FORM))
          .addBtn(new BaseBtn('删除',BtnPosition.Table,BtnAction.Delete,ActionType.API))
      return this;
  }
  /**
   * 添加导入导出按钮
   */
  addXlsBtn(){
    this.addBtn(new BaseBtn('导入',BtnPosition.Table,BtnAction.Import,ActionType.FORM))
        .addBtn(new BaseBtn('导出',BtnPosition.Table,BtnAction.Export,ActionType.API))
    return this;
  }
}
module.exports=GridConf;
