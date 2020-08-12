'use strict'
const Crud=require('./Crud');
class PermissionRole extends Crud {
  static boot () {
    super.boot()
  }
  async fields(){
    return [];
  }
  static get table(){
    return  'permission_role'
  }
}
module.exports = PermissionRole
