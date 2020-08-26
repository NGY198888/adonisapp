const { isNull, isArray, isObject, map } = require("lodash");
const ColumnTpl = require("./ColumnTpl");
class BaseField {
  /**
   * 字段基类
   * @param {String} label 字段标签名
   * @param {String} field 字段的属性字段
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
        this.show_label=true;
        this.field = field;
        this.val = null;
        this.searchVal=null;
        this.type=null;
        this.tpl=null;//表格列里显示的模板类型
        this.tplRules=[];

        this.valDic={}//字段的值映射，比如
        // {
        //   '1':'是',
        //   '0':'否',
        //   'null':'否'
        // }

        this.data=[];
        this.width=null

        //导入导出
        this.exportAble=false;
        this.exportType='string';
        this.exportWidth=25;
        this.importAble=false
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
        this.setExport(grid,'string',25,grid);
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
   /**
    * 字段在列表里的值映射
    * 接收数组和对象
    *
    *  {
    *       '1':'是',
    *       '0':'否',
    *       'null':'否'
    *   }
    * 或者
    * [
    *    {
    *      "id": "1",
    *      "txt": "是"
    *    },
    *    {
    *      "id": "0",
    *      "txt": "否"
    *    }
    *  ]
    * 'null':'xxx' 相当于默认值，没有设置就显示原文本
    * @param {[Array,Object]} dic 映射字典
    */
   setValDic(dic={}){
     if(!isObject(dic)){
       throw new Error('字段值映射请传对象');
     }
      dic = this.jsonModelArr(dic);
      this.valDic=dic
      return this;
   }
   getDicTxt(row){
     let rs=row[this.field];
     if(this.valDic){
       if(isArray(this.valDic)){
        let val=this.valDic.find(item=>item.id==row[this.field])
        rs=val?val.txt:row[this.field]
       }else{
        let search_v= row[this.field]==null?"null":row[this.field];
        let res=""
        res=this.valDic[search_v];
        rs=res!==undefined?res:row[this.field]
       }
     }
     return rs;
   }
   getDicVal(row){
    let rs=row[this.field];
    if(this.valDic){
      if(isArray(this.valDic)){
       let val=this.valDic.find(item=>item.txt==row[this.field])
        rs=val?val.id:row[this.field]
      }else{
        if(row[this.field]){
          for (const key in this.valDic) {
            if(this.valDic[key]==row[this.field])
            {
              rs= key;
              break;
            }
          }
        }
      }
    }
    return rs;
  }
   /**
    * 设置导入导出
    * @param {boolean} exportAble 该字段是否支持导出
    * @param {string} exportType 导出类型
    * @param {number} exportWidth 导出的宽度
    * @param {boolean} importAble 该字段是否支持导入
    */
   setExport(exportAble=true,exportType='string',exportWidth=25,importAble=true){
    this.exportAble=exportAble;
    this.exportType=exportType;
    this.exportWidth=exportWidth;
    this.importAble=importAble;
    return this;
   }
   getExportType(){
     return this.exportType;
   }
   getExportWidth(){
     return this.exportWidth;
   }
   /**
   * 设置待选数据
   * @param {[array,Function,Promise]} data
   */
  setData(data=[]){
    data = this.jsonModelArr(data);
    this.data=data
    this.setValDic(data)
    return this;
  }
  jsonModelArr(data) {
    if (isArray(data)) {
      data = map(data, (row) => {
        return row.toJSON ? row.toJSON() : row;
      });
    }
    return data;
  }

  /**
   * 有的表格组件，比如一对多子表，可以隐藏左边的label
   */
  hideLabel(){
    this.show_label=false;
    return this;
  }
  /**
   * 设置列的属性
   * @param {number} width 列宽
   */
  setColumn(width){
      this.width=width;
      return this;
  }
  /**
   * 取值的钩子
   * @param {*} data
   */
  onGetVal(data){

  }
  /**
   * 赋值的钩子
   * @param {*} row
   */
  onSetVal(row){

  }
  /**
   * 设置取值的钩子
   * @param {Function} onGetVal
   */
  setOnGetVal(onGetVal){
    this.onGetVal=onGetVal
    return this
  }
  /**
   * 设置赋值的钩子
   * @param {Function} onSetVal
   */
  SetOnSetVal(onSetVal){
    this.onSetVal=onSetVal
    return this
  }
}
module.exports=BaseField;
