const PageHook = exports = module.exports = {}

PageHook.checkPidIsSelf = async (modelInstance) => {
  // let ppp=await  modelInstance.page().fetch()
  // console.log('主表数据',ppp);
  let  id=modelInstance[modelInstance.constructor.primaryKey]
  let pid=modelInstance['pid']
    if(id==pid){
      throw new Error("不能选自己作为父级菜单");
    }
}
PageHook.fethPage=async (modelInstance) => {
    await modelInstance.load('page');
}
