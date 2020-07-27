'use strict'
const Crud=require('./Crud');
class Post extends Crud {
    static get rule_msgs(){
        return {
            'title.required': '标题未填写',
            'content.required': '内容未填写',
            'title.unique': '标题重复',
        };
    }
    static get fields(){
       return [
            {field:'_id',label:'ID',type:'text'},
            {   field:'title',label:'标题',type:'text',//基本
                default:'11111',val:'111122',placeholder:"搜索标题",searchable: true,//搜索
                grid:true,form:true,view:true//显示
                ,save:true,//是否保存数据库
                unique:true,//唯一性限制
                validator:'required'//验证器 required|email
            },
            {field:'content',label:'内容',type:'html',default:null,grid:true,form:true,view:true,save:true,validator:'required'},
            {label:'时间',type:'tab',searchable: true},
            {field:'updated_at',label:'更新时间',type:'date',default:null,searchable: true,grid:true,view:true},
            {field:'created_at',label:'创建时间',type:'date',default:null,searchable: true,grid:true,view:true},

       ]
    }
}

module.exports = Post
