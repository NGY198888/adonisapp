'use strict'

const Crud=require('./Crud');
class Page extends Crud {
    static get rule_msgs(){
        return {
            'name.required': '页面名称未填写',
            'url.required': '页面地址未填写',
            'name.unique': '页面名称重复',
        };
    }
    static get fields(){
        return [
            {field:'_id',label:'ID'},
            {   field:'name',label:'页面名称',type:'text',//基本
                default:null,placeholder:"搜索标题",searchable: true,//搜索
                grid:true,form:true,view:true//显示
                ,save:true,//是否保存数据库
                unique:true,//唯一性限制
                validator:'required'//验证器 required|email
            },
            {   field:'url',label:'页面地址',type:'text',//基本
                grid:true,form:true,view:true//显示
                ,save:true,//是否保存数据库
                validator:'required'//验证器 required|email
            },
            {   field:'icon',label:'图标',type:'text',//基本
                grid:true,form:true,view:true//显示
                ,save:true,//是否保存数据库
            },
            {   field:'isMenu',label:'是否菜单',type:'switch',//基本
                grid:true,form:true,view:true//显示
                ,save:true,//是否保存数据库
            },
            {   field:'_actions',label:'是否菜单',type:'switch',//基本
                grid:true,form:true,view:true//显示
                ,preview: {
                    label: "自定义",
                    // use lodash.template with { item: `current row data` }
                    to: "/rest/pages/<%= item._id %>/edit",
                    variant: "warning"
                  }
            },
            // {   name:'title',label:'页面名称',type:'text',//基本
            //     default:null,placeholder:"搜索标题",searchable: true,//搜索
            //     grid:true,form:true,view:true//显示
            //     ,save:true,//是否保存数据库
            //     unique:true,//唯一性限制
            //     validator:'required'//验证器 required|email
            // },
        ]

    }
}

module.exports = Page
