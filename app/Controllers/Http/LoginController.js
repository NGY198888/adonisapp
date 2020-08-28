'use strict'
const User=use('App/Models/User')
const Hash = use('Hash')
const axios = require('axios');
class LoginController {
  async redirect ({ ally }) {
    const url= await ally.driver('github')
    // .stateless()
    .getRedirectUrl()
    return url
  }

  async callback ({ ally, auth ,response}) {
    try {
      const fbUser = await ally.driver('github').getUser()

      // user details to be saved
      const userDetails = {
        username: fbUser.getEmail(),
        password:await Hash.make('123456'),
        role_user:[{role_id:'87278794-352d-438b-8ad2-d0362a64da68'}]
        // token: fbUser.getAccessToken(),
        // login_source: 'github'
      }

      // search for existing user
      const whereClause = {
        username: fbUser.getEmail()
      }

      const user = await User.findOrCreate(whereClause, userDetails)

      // await auth.login(user)
      let token=await auth.attempt(user.username,'123456');
      response.redirect('http://localhost:8080/login?logined='+escape( JSON.stringify({
        user,
        token:token.token
      })));
    } catch (error) {
      return error.message
    }
  }
}

module.exports = LoginController
