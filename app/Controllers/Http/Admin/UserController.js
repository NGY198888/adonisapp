'use strict'
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User=use('App/Models/User')
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Validator')} */
const {validate}=use('Validator')
const _lodash = require('lodash');
/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
const CrudController = require("./CrudController");
const TextField = require('../../../crud/field/TextField');

class UserController  extends CrudController{
  get resource(){
    return 'users'
  }
  async  beforeAdd(model_instance){
    model_instance.password=await Hash.make(model_instance.password||'123456')
  }
  async formView({ params, request, response }){
    console.log('进入user formView');
    let _model=new this.model();
  let fields=  [
      new TextField('用户名','username').setUIConf(true,true,true,false,false).setDBConf(true,true,'required').check(),
      new TextField('密码','password').setUIConf(false,true,false,false,false)
      .setTypePassword()
      .setDBConf(true,false,'required').check(),
      new TextField('确认密码','password2').setUIConf(false,true,false,false,false)
      .setTypePassword()
      .setDBConf(false,false,'required').check(),
    ]
    return {
      fields,
      row:global.request._user,
    }
  }
  async formViewSave({ params, request, response }){
    console.log('进入user formViewSave');
    let row=global.request._user
    const rules = {
      username: 'required',
      password: 'required'
    }
    const msgs={
      'username.required': '用户名未填写',
      'password.required': '密码未填写',
    };
    let  password2=request.all()['password2']
    let  data=request.only(['password', 'username'])
    if(password2!=data['password']){
        throw new Error("密码不一致")
    }
    const validation = await validate(request.all(), rules,msgs)

    if (validation.fails()) {
        return response.status(422).send({
          message:validation.messages()
      });
    }
    data.password= await Hash.make(data.password)
    data.email=data.username
    row.merge(data);
    await row.save();
    return  {message:'success'};
  }
  //这是一个自定义按钮的提交接口
  test=async({request, response})=>{
       let {row,id,ids,where}=  request.all();
      let rs=  await new this.model().baseQuery().fetch()
      const nodeExcel = require('excel-export');
      const xlsx = require('node-xlsx');

      async function readydata() {
        //做点什么，如从数据库取数据
        let exceldata=[
            {name:"张三",age:"20",sex:"男",birthday:"1998-10-10"},
            {name:"李四",age:"21",sex:"男",birthday:"1997-08-08"},
            {name:"王五",age:"22",sex:"男",birthday:"1996-06-06"},
            {name:"赵六",age:"20",sex:"男",birthday:"1998-12-12"},
        ];
        return exceldata;
    }
    //导出
    async function exportdata(v) {
        let conf ={};
        conf.name = "mysheet";//表格名
        let alldata = new Array();
        for(let i = 0;i<v.length;i++){
            let arr = new Array();
            arr.push(v[i].name);
            arr.push(v[i].age);
            arr.push(v[i].sex);
            arr.push(v[i].birthday);
            alldata.push(arr);
        }
        //决定列名和类型
        conf.cols = [{
            caption:'姓名',
            type:'string'
        },{
            caption:'年龄',
            type:'number'
        },{
            caption:'性别',
            type:'string'
        },{
            caption:'出生日期',
            type:'string',
            //width:280
        }];
        conf.rows = alldata;//填充数据
        let result = nodeExcel.execute(conf);
        let data =new  Buffer.from(result,'binary')
        let realName = encodeURI("data.xlsx","GBK")
        realName = realName.toString('iso8859-1')//中文附件名特殊处理
        response.header('Content-Type', 'application/octet-stream');
        response.header("Content-Disposition", "attachment; filename=" + realName);
        return response.send(data);
    }
    let r=await readydata();
    await exportdata(r);

  }


}

module.exports = UserController
