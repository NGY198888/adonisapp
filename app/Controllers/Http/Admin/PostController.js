'use strict'

const Post=use('App/Models/Post')
const {validate}=use('Validator')
const _lodash = require('lodash');
const CrudController = require('./CrudController');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController  extends CrudController  {
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
    query = JSON.parse(query|| "{}");
    const { page = 1, perPage = 10, sort = {}, where = null } = query;
    _lodash.mapValues(query.where, (v, k) => {
      if (v === '' || v === null || _lodash.isEqual(v, []) || _lodash.isEqual(v, [null])) {
        return delete query.where[k]
      }
      const isDate = ['created_at', 'updated_at'].includes(k)
      if (isDate) {
        
        let [begin, end] = v
        if (_lodash.isString(v)) {
          begin=new Date(v);
          end =new Date(v);
          end=end.setDate(begin.getDate()+1);
          end=new Date(end);
        }
        if (!end) {
          end =new Date(begin) + 1
        }
        query.where[k] = { $gte: begin, $lte: end }
        return
      }
      if (_lodash.isString(v)
          // && v.includes('*')
       ) {
        query.where[k] = new RegExp(v.replace('*', ''), 'i')
      }
      if (_lodash.isArray(v) && !_lodash.isObject(v[0])) {
        query.where[k] = { $in: v }
      }
    })
    console.log( query.where);
    
     return await Post.query().where( query.where).sort(sort).paginate(page,perPage);
  }

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
  async store ({ request,session, response }) {
    // let {title,content}=request.all()
    const rules = {
      title: 'required|unique:posts,title',
      content: 'required'
    }
    const msgs={
      'title.required': '标题未填写',
      'content.required': '内容未填写',
      'title.unique': '标题重复',
    };
    const validation = await validate(request.all(), rules,msgs)

    if (validation.fails()) {
      console.log(validation.messages());
      
      // session
      //   .withErrors(validation.messages())
      //   .flashExcept(['title','content'])

      return response.status(400).send(validation.messages())
    }
    let post=new Post(request.all())
    const model= await post.save();
    return post
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
      const model= await Post.find(params.id);
      return model
    }
  }
 
  async edit ({ params, request, response, view }) {
  }

  
  async update ({ params, request, response }) {
    let data=request.only(['title', 'content'])
    const model= await Post.find(params.id);
    model.merge(data);
    await model.save();
    return model
  }

  
  async destroy ({ params, request, response }) {
    const model= await Post.find(params.id);
    model.delete()
    return {success:true}
  }
  async grid(){
    console.log('grid');
    return {
    searchModel: {},
    searchFields:{
      title:{label:'标题'},
      content:{label:'内容', type:'text'},
      updated_at:{label:'更新时间'
      ,type:'date'
      // ,range:true
    },
    },
      fields:{
        _id:{label:'ID'},
        title:{label:'标题',  searchable: true,description: "title" },
        updated_at:{label:'更新时间',searchable: true,type:'datetime'},
        created_at:{label:'创建时间',type:'datetime'},
      }
    }
  }
  async form(){
    console.log('form');
    
    return {
      fields:{
        title:{label:'标题'},
        content:{label:'内容',type:'html'}
      }
    }

  }
  async view(){
    console.log('view');
    return {
      fields:{
        // _id:{label:'ID'},
        title:{label:'标题'},
        content:{label:'内容',type:'html'},
        updated_at:{label:'更新时间',type:'datetime'},
        created_at:{label:'创建时间',type:'datetime'},
      }
    }
  }
}

module.exports = PostController
