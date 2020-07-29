const _ = require('lodash');
const  text="text"
const  info="info"
const  primary="primary"
const  success="success"
const  warning="warning"
const  danger="danger"

const check=(color)=>{
  if(_.isUndefined([text,info,primary,success,warning,danger].find(item=>item==color))){
     throw new Error('按钮颜色不对,请参阅ColorType');
  }
}
module.exports={
  text,
  info,
  primary,
  success,
  warning,
  danger,
  check,
}
