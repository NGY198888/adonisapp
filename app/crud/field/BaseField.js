const { isNull } = require("lodash");
const ColumnTpl = require("./ColumnTpl");

class BaseField {
  /**
   * 按钮
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性名
   */
    constructor(label, field = null) {
        this.isUI = false;
        this.grid = false;
        this.form = false;
        this.view = false;
        this.save = true;
        this.unique = false;
        this.searchable = false;
        this.sortable = false;
        this.validator = null;
        this.field2 = null;
        this.label = label;
        this.field = field;
        this.val = null;
        this.searchVal=null;
        this.type=null;
        this.tpl=null;//表格列里显示的模板类型
        this.tplRules=[];
    }
    /**
     * UI配置
     * @param {Boolean} grid 是否显示在表格里
     * @param {Boolean} form 是否显示在编辑表单里
     * @param {Boolean} view 是否显示在查看界面
     * @param {Boolean} searchable 是否显示在搜索栏
     * @param {Boolean} sortable 是否可以排序
     * @returns BaseField
     */
    setUIConf(grid, form = false, view = false, searchable = false, sortable = false) {
        this.grid = grid;
        this.form = form;
        this.view = view;
        this.save = true;
        this.unique = false;
        this.searchable = searchable;
        this.sortable = sortable;
        return this;
    }
    /**
     * 设置默认值
     * @param {*} val 表单默认值
     * @param {*} searchVal 搜索默认值
     * @returns BaseField
     */
    setVal(val = null,searchVal=null) {
      this.val = val;
      this.searchVal=searchVal;
      return this;
    }
    /**
     * 设数据库相关属性
     * @param {Boolean} save 是否保存数据库
     * @param {Boolean} unique  是否要求在数据库中唯一
     * @param {Boolean} validator adonis验证器 例如 'required|email|unique:users,username'
     * @returns BaseField
     */
    setDBConf(save, unique = false, validator = null) {
        this.save = save;
        this.unique = unique;
        this.validator = validator;
        return this;
    }
    /**
     * 检查配置
     * @returns BaseField
     */
    check() {
        if (isNull(this.type)) {
            throw Error("type 未定义");
        }
        if (isNull(this.label)) {
            throw Error("label 必填");
        }
        if (!this.isUI && isNull(this.field)) {
            throw Error("field 必填");
        }
        return this;
    }
    /**
     * 字段查询方式 子类要重写此方法
     * @param {*} query 查询对象  query.where(this.field,'like', `%${this.val}%`)
     * @returns BaseField
     */
    parseQuery(query,_model) {
     //子类要重写此方法，并返回this
      return this
    }
    _field(_model){
      return `${_model.tableAlias()}.${this.field}`
   }
   /**
    * 设置列模板
    * @param {*} tpl 模板类型
    * @param {*} tplRules  模板规则
    */
   setColumnTpl(tpl=ColumnTpl.NotTpl,tplRules=[]){
      ColumnTpl.check(tpl);
      this.tpl= tpl;
      this.tplRules=tplRules;
      return this;
   }
}
module.exports=BaseField;
