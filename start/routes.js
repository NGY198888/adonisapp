'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
var inflection = require( 'inflection' );
const fs=require('fs')
const path = require('path')
const { resolver, ioc } = require('@adonisjs/fold')
const Helpers = use('Helpers')
// Route.get('/','Admin/SiteController.site')
Route.get('/api/blog','BlogController.index')
Route.post('admin/api/reg','UserController.reg')
Route.post('admin/api/login','UserController.login')
let crud_list=['users','posts','site'];
Route.group(() => {
    Route.post('/upload','FileUploadController.upload')
    Route.get('/site','Admin/SiteController.site')
    Route.get('/site/settings','Admin/SiteController.settings')
    Route.post('/site/settings','Admin/SiteController.save_settings')
    Route.get('/home','Admin/SiteController.home')
    Route.get('/posts/grid:id?', 'Admin/PostController.grid')
    Route.get('/posts/form:id?', 'Admin/PostController.form')
    Route.get('/posts/view:id?', 'Admin/PostController.view')
    Route.resource('/posts', 'Admin/PostController')
    for (let index = 0; index < crud_list.length; index++) {
        //优先匹配这里
        const resource = crud_list[index];
        const className= inflection.classify(resource);
        Route.get(`/form/${resource}`, `Admin/${className}Controller.formView`)
        Route.post(`/form/save/${resource}`, `Admin/${className}Controller.formViewSave`)
        Route.post(`/${resource}/deleteAll`, `Admin/${className}Controller.deleteAll`)
        Route.get(`/${resource}/grid:id?`, `Admin/${className}Controller.grid`)
        Route.get(`/${resource}/form:id?`, `Admin/${className}Controller.form`)
        Route.get(`/${resource}/view:id?`, `Admin/${className}Controller.view`)
        Route.resource(`/${resource}`, `Admin/${className}Controller`)
    }
  //  let pathName=path.join(Helpers.appRoot(),'/App/Controllers/Http/Admin')
  //  fs.readdir(pathName, function(err, files){
  //       for (var i=0; i<files.length; i++)
  //       {
  //          let fileName= files[i]
  //          let controller=fileName.replace('.js','')
  //          let clazz=use(`App/Controllers/Http/Admin/${controller}`)
  //          let instance=new clazz();
  //          let isCrud=false
  //          try {isCrud= instance.isCrud } catch (error) {}
  //          let resource=inflection.pluralize(fileName.replace('Controller.js','')).toLowerCase()
  //          if(isCrud&&resource!=="cruds"){
  //               console.log("注册crud路由",resource);
  //               Route.get(`/form/${resource}`, `Admin/${controller}.formView`)
  //               Route.post(`/form/save/${resource}`, `Admin/${controller}.formViewSave`)
  //               Route.post(`/${resource}/deleteAll`, `Admin/${controller}.deleteAll`)
  //               Route.get(`/${resource}/grid:id?`, `Admin/${controller}.grid`)
  //               Route.get(`/${resource}/form:id?`, `Admin/${controller}.form`)
  //               Route.get(`/${resource}/view:id?`, `Admin/${controller}.view`)
  //               Route.resource(`/${resource}`, `Admin/${controller}`)
  //          }
  //       }
  //   });
    Route.get('/form/:resource', 'Admin/CrudController.formView')
    Route.post('/form/save/:resource', 'Admin/CrudController.formViewSave')
    Route.post(':resource/deleteAll', 'Admin/CrudController.deleteAll')
    Route.get(':resource/grid:id?', 'Admin/CrudController.grid')
    Route.get(':resource/form:id?', 'Admin/CrudController.form')
    Route.get(':resource/view:id?', 'Admin/CrudController.view')
    Route.resource(`:resource`, `Admin/CrudController`)
    Route.get('logout','UserController.logout')



}).prefix("admin/api").middleware('auth');//
// Route.get('/:id','SetController.index')
// Route.on('/').render('welcome')
// Route.resource('/api/:resource', 'RestController')
// Route.rest('/rest/api', 'api')
// Route.rest('/rest/admin', 'admin')
