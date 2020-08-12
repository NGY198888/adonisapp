const BaseField= require('./BaseField');
const { map } = require('lodash');

class TreeField extends BaseField{

  constructor(label, field = null){
    super(label, field)
    this.type="tree"
    this.resource=field;
    this.height=390;
    this.val=[];
  }
  parseQuery(query,_model) {
    return this
  }
  /**
   * 设置待选数据
   * @param {[array,Function,Promise]} data
   */
  setData(data=[]){
    data.unshift({
      id:'-1',
      name:'全部',
      pid:null
    })
    this.data=data
    this.setValDic(data)
    return this;
  }

}
 module.exports=TreeField;
