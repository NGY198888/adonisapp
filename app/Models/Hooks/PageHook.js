const PageHook = exports = module.exports = {}

PageHook.checkPidIsSelf = async (modelInstance) => {
  let  id=modelInstance[modelInstance.constructor.primaryKey]
  let pid=modelInstance['pid']
    if(id==pid){
      throw new Error("不能选自己作为父级菜单");
    }
}
