const _ = require('lodash');
/** 无界面类按钮 */
const  API="API"//不会弹出界面，直接调用接口，关联confirmTips，commit_url
/** 表单提交类按钮 */
const  FORM="FORM"

const check=(actionType)=>{
   if(_.isUndefined([API,FORM].find(item=>item==actionType))){
    throw new Error('按钮类型不对,请参阅ActionType');
   }
}
module.exports={
  API,
  FORM,
  check,
}
