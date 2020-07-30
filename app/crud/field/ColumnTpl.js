const _ = require('lodash');
const { isArray } = require('lodash');
const  NotTpl=null
const  Tag="Tag"
/**
 * 设置标签规则
 * 类似于
 * {
 *    success:1,
 *    info:"2",
 *    warning:[],
 *    danger:null,
 * }
 * @param {Object} rules
 */
const  newTagRules=(rules)=>{
      // null/success/info/warning/danger
     let rs={
        success:null,
        info:null,
        warning:null,
        danger:null,
     };
     Object.assign(rs,rules)
     return rs;
}
const check=(tpl)=>{
   if(_.isUndefined([NotTpl,Tag].find(item=>item==tpl))){
    throw new Error('表格列模板类型不对,请参阅ColumnTpl');
   }
}
module.exports={
  NotTpl,
  Tag,
  check,
  newTagRules,
}
