const _ = require('lodash');
const BaseBtn = require("../btn/BaseBtn");
const BtnAction = require("../btn/BtnAction");
const BaseField = require("../field/BaseField");
const ActionType = require('../btn/ActionType');
const BtnPosition = require('../btn/BtnPosition');
const ColorType = require('../btn/ColorType');
var inflection = require( 'inflection' );
const Page = require('../../Models/Page');
class GridConf {
  /**
   * 表格配置
   * @param {string} table 表名
   * @param {string} key 表主键
   * @param {string} sortStr 排序字符串， 比如'age desc'
   * @param {boolean} multSelect 是否支持多选
   */
  constructor(table,key='id',sortStr=null,multSelect=false){
    this.table=table//表
    this.key=key//主键
    this.sortStr=sortStr//排序
    this.multSelect=multSelect//多选
    this.tableSearchFields=[]//搜索字段
    this.tableFields=[]//列表字段
    this.formFields=[]//新增，编辑字段
    this.viewFields=[]//显示字段
    this.buttons=[]
    // 分页配置
    this.pagination=true//是否分页，目前不支持不分页
    this.page=1
    this.total=0
    this.pageSize=20
    this.pageSizes=[20,40,100,500,100000]
    //汇总配置
    this.showSummary=false
    this.summaryFrom="local"

    //树形表格配置
    this.pidField=null
    this.lazy=false
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
    //this.buttons= _.uniqBy(this.buttons,"name")
    this.buttons.forEach(btn => {
       if(btn.isMultSelect){
          this.enableMultSelect()
       }
    });
    return this
  }
  /** 启用多选 */
  enableMultSelect(){
    this.multSelect=true
    return this;
  }
  /**
   * 添加增删改按钮
   * @param {boolean} needConfirm 是否需要删除确认
   */
  addCrudBtn(needConfirm){
      this.addBtn(new BaseBtn('新建',BtnPosition.Table,BtnAction.Add,ActionType.FORM).setUI('el-icon-plus',ColorType.success))
          .addBtn(new BaseBtn('编辑',BtnPosition.Row,BtnAction.Edit,ActionType.FORM).setUI('el-icon-edit',ColorType.primary))
          .addBtn(new BaseBtn('查看',BtnPosition.Hiden,BtnAction.Show,ActionType.FORM).setUI('el-icon-view',ColorType.info))
          .addBtn(new BaseBtn('删除',BtnPosition.Row,BtnAction.Delete,ActionType.API).setUI('el-icon-delete',ColorType.danger)
          .setConfirmTips(needConfirm?"此操作将删除该记录!，您是否要继续？":null))
          .addBtn(new BaseBtn('删除',BtnPosition.Table,BtnAction.Delete,ActionType.API).setUI('el-icon-delete',ColorType.danger)
          .enableMultSelect()
          .setConfirmTips(needConfirm?"此操作将删除选中的所有记录!，您是否要继续？":null))
      return this;
  }
  getBtns(){
    return this.buttons;
  }
  /**
   * 添加导入导出按钮
   */
  addXlsBtn(){
    this.addBtn(new BaseBtn('导入',BtnPosition.Table,BtnAction.Import,ActionType.API).setUI('fa fa-upload',ColorType.primary))
        .addBtn(new BaseBtn('导出',BtnPosition.Table,BtnAction.Export,ActionType.API).setUI('fa fa-download',ColorType.info))
    return this;
  }
 /**
  * 表尾合计
  * @param {*} showSummary
  * @param {['local','remote']} summaryFrom 合计数据源 local只会合计本地数据 remote则是由后台接口返回
  */
  setSummary(showSummary=true,summaryFrom='local'){
    this.showSummary=showSummary;
    this.summaryFrom=summaryFrom;
    return this;
  }
  /**
   * 设置树形表格
   * @param {string} pidField 父ID字段
   * @param {string} idField   ID 默认是表的主键
   * @param {Boolean} lazy 是否懒加载
   */
  setTreeGrid(pidField,idField=this.key,lazy=false){
    this.pidField=pidField
    this.key=idField
    this.lazy=lazy
    if(this.pidField){//树形表格不打算分页
       this.setPagination(false,10000)
    }
    return this;
  }
  async removeBtns(){
    let resource=inflection.tableize(this.table)
    const Database = use('Database')
    let page=await Database.table('pages').where('code', resource);
    if(page.length>0){
      let pps= await global.request._user.permissionSql(global.request._user.id)
      let path_arr=[];
      let useable_btns=[];
      pps.forEach(p => {
        path_arr.push(p['path'])
      });

      this.buttons.forEach(btn => {
        path_arr.find(item=>item.indexOf(`${resource}/${btn.action}`) >= 0)&&useable_btns.push(btn);
      });
      this.buttons=useable_btns;
    }
  }
  async check(permission){
    if(permission){
      await this.removeBtns()
    }
    return this;
  }
}
module.exports=GridConf;
