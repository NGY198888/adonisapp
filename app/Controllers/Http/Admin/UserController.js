'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User=use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const CrudController = require("./CrudController")

class UserController  extends CrudController{
     
      /**
     * Show a list of all abresources.
     * GET abresources
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index ({ request, response, view }) {
      let query= (request.all().query);
      if(_lodash.isString(query)){
        query=JSON.parse(query)
      }
      return await User.query().paginate(query.page,10);
    }
    // get resource(){
    //   const request = global.request
    //   let url=_lodash.trimStart(global.request.url() ,'admin/api')
    //   let name= inflection.classify(url.split('/')[0]) 
    //   console.log('url',url,name);
    
    //   return 'User';
    // }
    /**
     * Render a form to be used for creating a new abresource.
     * GET abresources/create
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async create ({ request, response, view }) {
    }
   
  
    /**
     * Create/save a new abresource.
     * POST abresources
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store ({ request, response,session }) {
     let _model=  this.model;
        const rules = {
            username: 'required|email|unique:users,username',
            password: 'required'
          }
          const msgs={
            'username.required': '用户名未填写',
            'username.unique': '用户名已存在',
            'password.required': '密码未填写',
            'username.email': '用户名需要填写邮箱',
          };
          console.log(request.all());
          let  data=request.only(['password', 'username'])
          const validation = await validate(request.all(), rules,msgs)
      
          if (validation.fails()) {
              return response.status(422).send({
                message:validation.messages()
            });
          }
          data.email=data.username
          let user=new _model(data);
          await user.save();
          return user;
    }

    /**
     * Display a single abresource.
     * GET abresources/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show ({ params, request, response, view }) {
      if(params.id){
        const model= await User.find(params.id);
        return model
      }
    }

    /**
     * Render a form to update an existing abresource.
     * GET abresources/:id/edit
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async edit ({ params, request, response, view }) {
    }

    /**
     * Update abresource details.
     * PUT or PATCH abresources/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update ({ params, request, response }) {
      const model= await User.find(params.id);
      const rules = {
        username: `required|email|unique:users,username,_id,${params.id}`,//,_id,${params.id}
        password: 'required'
      }
      const msgs={
        'username.required': '用户名未填写',
        'username.unique': '用户名已存在',
        'password.required': '密码未填写',
        'username.email': '用户名需要填写邮箱',
      };
      let  data=request.only(['username','password'])
      const validation = await validate(data, rules,msgs)
      if (validation.fails()) {
        return response.status(422).send({
          message:validation.messages()
      });
      }
      data.email=data.username
      model.merge(data);
      await model.save();
      return model
    }

    /**
     * Delete a abresource with id.
     * DELETE abresources/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy ({ params, request, response }) {
      const model= await User.find(params.id);
      model.delete()
      return {success:true}
    }
    async grid(){
      console.log('grid');
      this.model
      return {
        fields:{
          _id:{label:'ID'},
          username:{label:'用户名'},
          updated_at:{label:'更新时间',type:'datetime'},
          created_at:{label:'创建时间',type:'datetime'},
        }
      }
    }
    async form(){
      console.log('form');
      
      return {
        fields:{
          username:{label:'用户名'},
          password:{label:'密码'},
        }
      }

    }
    async view(){
      console.log('view');
      return {
        fields:{
          // _id:{label:'ID'},
          username:{label:'用户名'},
          updated_at:{label:'更新时间',type:'datetime'},
          created_at:{label:'创建时间',type:'datetime'},
        }
      }
    }
}

module.exports = UserController
