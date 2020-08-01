const PostHook = exports = module.exports = {}
PostHook.addAuthor = async (modelInstance) => {
  let _user= global.request._user
  if(_user){
    let uid= _user[_user.constructor.primaryKey]
    modelInstance['author']=uid
  }
}
PostHook.fethComments=async (modelInstance) => {
  await modelInstance.load('comments');
}

