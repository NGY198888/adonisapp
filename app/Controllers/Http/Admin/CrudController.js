'use strict'
var inflection = require( 'inflection' );
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
const { unset } = require('lodash');
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
      let _resource =inflection.classify(this.resource)
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
      // let rs={
      //   "total": 10000,
      //   "perPage": 10000,
      //   "page": 1,
      //   "lastPage": null,
      //   "data": [ ]
      // }
      // let item={
      //   "id": "cb555738-120a-47d1-b973-633c74462b19",
      //   "username": "admin",
      //   "email": "admin2222",
      //   "created_at": "2020-07-29 18:24:18",
      //   "updated_at": "2020-07-30 00:44:54",
      //   "deleted_at": null
      // };
      // rs.data= Array(10000).fill(item)
      // return rs; // 模拟大分页数据，结果在页面渲染那边卡很久
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
            let model_instance=new _model();
            let data =await this.getData(request, model_instance,'Add');
            await this.validate(response,request,model_instance);
            model_instance=Object.assign(model_instance,data);
            await model_instance.save();
            return model_instance;
      }

   async getData(request, model_instance,action='Add') {
      //新增时没有填的字段可能不会上传，导致该数据缺少字段，这里要将这些字段填空
      //但是更新的时候是上传什么就更新什么，填空不能做
     let saveFields= await model_instance.saveFields()
      let data = request.only( saveFields);
      if(action=="Add"){
        let _obj = {};
        _lodash.reduce(saveFields, function (obj, param) {
          obj[param] = null;
          return obj;
        }, _obj);
        data = _lodash.merge(_obj, data);
      }
      let _fields=  await model_instance.fields()
      let formFields = model_instance._fields2ObjArr(_fields,"form");
      formFields.forEach(formField => {
        if(Object.prototype.hasOwnProperty.call(data, formField.field))
          formField.onGetVal(data)
      });
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
          let model_instance= await this.model.find(params.id);
          model_instance=model_instance .toJSON()
          _form.fields.forEach(field => {
            if(Object.prototype.hasOwnProperty.call(model_instance, field.field)){
              field.onSetVal(model_instance)
            }
          });
          return model_instance
        }else{
          throw new Error('缺少资源id信息');
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
        let data =await this.getData(request, model_instance,'Edit');
        await this.validate(response,request,model_instance);

        model_instance.merge(data);
        await model_instance.save();
        return model_instance
      }
      async validate(response,request,model_instance){
        let rules=await model_instance.rules()
        let rule_msgs=await model_instance.rule_msgs()
          if(rules){
            const validation = await validate(request.all(), rules,rule_msgs)
            if (validation.fails()) {
                return response.status(422).send({
                  message:validation.messages()
              });
            }
          }
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
        let data=new this.model().grid();
        return data
      }
       /** 表单显示需要的数据 */
      async form(){
        console.log('进入crud form');
        return  new this.model().form()

      }
      /**查看显示需要的数据 */
      async view(){
        console.log('进入crud view');
        return await new this.model().view()
      }
      async deleteAll({ params, request, response }){
        console.log('进入 deleteAll');
        let ids= request.post()['ids']
        await (new this.model()).deleteAll(ids)
        return {message:'success'};
      }
      async formView({ params, request, response }){
        console.log('进入formView');
        let _model=new this.model();
        let _form=await _model.form()
        let rows=await _model.baseQuery().fetch();
        let row=rows.rows.length>0?rows.rows[0].toJSON():{}
        _form.fields.forEach(field => {
          if(Object.prototype.hasOwnProperty.call(row, field.field)){
            field.onSetVal(row)
          }
        });
        return {
          fields:_form.fields,
          row,
        }
      }
      async formViewSave({ params, request, response }){
        console.log('进入formViewSave');
        let _model=new this.model();
        let rows=await _model.baseQuery().fetch();
        let row=rows.rows.length>0?rows.rows[0]:new this.model()
        let data =await this.getData(request, row,'Edit');
        await this.validate(response,request,row);
        row.merge(data);
        await row.save();
        return  {message:'success'};
      }

}

module.exports = CrudController
