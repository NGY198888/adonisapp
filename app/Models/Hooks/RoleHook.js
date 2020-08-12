const { map } = require("lodash");

const RoleHook = exports = module.exports = {}

RoleHook.fethPermissions=async (modelInstance) => {
  await modelInstance.load('permission_role');
}
RoleHook.deleteSubTable=async (modelInstance) => {
  await modelInstance.load('permission_role');
  const comments = modelInstance.getRelated('permission_role')
  comments.delete();
}
