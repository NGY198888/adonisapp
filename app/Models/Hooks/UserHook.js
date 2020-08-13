'use strict'
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const UserHook = exports = module.exports = {}
/**加密明文密码 */
UserHook.encryptionPwd = async (modelInstance) => {
    modelInstance.password=modelInstance.password|| modelInstance.dirty.password||'123456'
    modelInstance.password = await Hash.make(modelInstance.password)
}
/**填充Email */
UserHook.addEmail = async (modelInstance) => {
   if (modelInstance.dirty.username) {
      modelInstance.email =modelInstance.username
    }
}
