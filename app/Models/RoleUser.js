'use strict'
const Crud=require('./Crud');
class RoleUser extends Crud {
  static boot () {
    super.boot()
  }
  async fields(){
    return [];
  }
  static get table(){
    return  'role_user'
  }
}
module.exports = RoleUser
