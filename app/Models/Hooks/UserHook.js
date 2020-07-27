'use strict'
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const UserHook = exports = module.exports = {}
/**加密明文密码 */
UserHook.encryptionPwd = async (modelInstance) => {
    if (modelInstance.dirty.password) {
        modelInstance.password = await Hash.make(modelInstance.password)
      }
}
/**填充Email */
UserHook.addEmail = async (modelInstance) => {
   if (modelInstance.dirty.password) {
      modelInstance.email =modelInstance.username
    }
}

