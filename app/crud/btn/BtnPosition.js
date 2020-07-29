const _ = require('lodash');
/**按钮处于行内操作列 */
const  Row="Row"//行内的按钮，或者说依赖选中行
/** 按钮处于表格上面 */
const  Table="Table"

const  Hiden="Hiden"
const check=(position)=>{
  if(_.isUndefined([Row,Table,Hiden].find(item=>item==position))){
     throw new Error('按钮类型不对,请参阅BtnPosition');
  }
}
module.exports={
  Row,
  Table,
  Hiden,
  check,
}
