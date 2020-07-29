'use strict'
var inflection = require( 'inflection' );
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
class CrudController {
    get isCrud(){
       return true;
    }
    get resource(){
        const request = global.request
        let resource=request.params.resource
        if(!resource){
            let url=_lodash.trimStart(request.url() ,'admin/api')
            resource= inflection.classify(url.split('/')[0])
        }else{
            resource= inflection.classify(resource)
        }
        return resource
    }
    get model(){
      let _resource =this.resource
      try {
        const model = use('App/Models/' +_resource)
        return model
      } catch (error) {
        throw new Error(_resource+' model不存在');
      }


    }
     /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index ({ request, response, view }) {
      return new this.model().parseQuery(request);
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
      async store ({ request, response,session }) {
            let _model=  this.model;
            let data = this.getData(request, _model);
            if(_model.rules){
              const validation = await validate(request.all(), _model.rules,_model.rule_msgs)
              if (validation.fails()) {
                  return response.status(422).send({
                    message:validation.messages()
                });
              }
            }
            let model_instance=new _model();
            model_instance=Object.assign(model_instance,data);
            await model_instance.save();
            return model_instance;
      }

    getData(request, _model) {
      //没有填的字段可能不会上传，导致该数据缺少字段，这里要将这些字段填空
      let data = request.only(_model.saveFields);
      let _obj = {};
      _lodash.reduce(_model.saveFields, function (obj, param) {
        obj[param] = null;
        return obj;
      }, _obj);
      data = _lodash.merge(_obj, data);
      return data;
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
          const model_instance= await this.model.find(params.id);
          return model_instance
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
        let _model=  this.model;
        const model_instance= await _model.find(params.id);
        let data = this.getData(request, _model);
        if(_model.rules){
          const validation = await validate(request.all(), _model.rules,_model.rule_msgs)
          if (validation.fails()) {
              return response.status(422).send({
                message:validation.messages()
            });
          }
        }
        model_instance.merge(data);
        await model_instance.save();
        return model_instance
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
        const model_instance= await this.model.find(params.id);
        model_instance.delete()
        return {success:true}
      }
      /** 列表显示需要的数据 */
      async grid(){
        console.log('进入crud grid');
        let data=this.model.grid;
        return data
      }
       /** 表单显示需要的数据 */
      async form(){
        console.log('进入crud form');
        return this.model.form

      }
      /**查看显示需要的数据 */
      async view(){
        console.log('进入crud view');
        return this.model.view
      }

}

module.exports = CrudController
