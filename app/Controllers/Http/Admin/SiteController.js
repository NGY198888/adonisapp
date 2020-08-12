'use strict'

const CrudController = require('./CrudController');
const Page = require('../../../Models/Page');
class SiteController extends CrudController {

  get resource(){
     return 'site'
  }
  async site(){
       let rs= {
            name:'我的博客',
            logo: "http://www.baidu.com/img/flexible/logo/pc/result.png",
            locale_switcher: true,
            theme_switcher: true,
            theme: "materia",
            url: "https://github.com/wxs77577/rest-admin",
            grid_style: 1,
            footer1: `
                <span class="ml-auto">
                    GitHub <a href="https://github.com/wxs77577/rest-admin">https://github.com/wxs77577/rest-admin</a>
                </span>
                <script>
                //Baidu Statistic
                var _hmt = _hmt || [];
                (function() {
                    var hm = document.createElement("script");
                    hm.src = "https://hm.baidu.com/hm.js?8ec67f6e612d57c8a9f2e21a32ddf4ff";
                    var s = document.getElementsByTagName("script")[0];
                    s.parentNode.insertBefore(hm, s);
                })();
                </script>`,
            css: [`http://localhost:8080/static/custom.css`],
            menu:[
                {
                    name: "首页",
                    url: "/home",
                    exact: true,
                    icon: "icon-home"
                },
                {
                    name: "内容",
                    url:"",
                    icon:'el-icon-circle-plus-outline',
                    title: true,
                    children:[
                      {
                        name:'帖子管理',
                        url:'/rest/posts',
                        icon:'el-icon-collection-tag'
                    },
                    {
                        name:'用户管理',
                        url:'/rest/users',
                        icon:'el-icon-collection-tag'
                    },
                    ]
                },
                // {
                //     name:'帖子管理',
                //     url:'/rest/posts',
                //     icon:'fa fa-weixin'
                // },
                // {
                //     name:'用户管理',
                //     url:'/rest/users',
                //     icon:'fa fa-user'
                // },
                {
                    name: "系统设置",
                    url:'/form/site',
                    icon: "el-icon-edit",
                    title: true
                  },
                  {
                    name:'页面管理',
                    url:'/rest/pages',
                    icon:'fa fa-user'
                 },
                  {
                    name: "设置",
                    url: "/form/site.settings",
                    icon: "el-icon-edit"
                    // a custom form.
                  },
                  // {
                  //   divider: true
                  // },
                  {
                    name: "退出系统",
                    url: "/logout",
                    icon: "icon-lock"
                  },
                  {
                    name: "外部页面",
                    external: true,
                    url: "http://localhost:8080/NGY198888.gtihub.io",
                    icon: "el-icon-link"
                  }
            ]
        }
        // const Database = use('Database')
        // let ps=await Database
        // .table('permission as p')
        // .joinRaw("left join permission as p2 on p.path  like concat(p2.path,'%') ")
        // .innerJoin('permission_role as pr', 'pr.permission_id', 'p.id')
        // .innerJoin('role_user as ru', 'pr.role_id', 'ru.role_id')
        // .innerJoin('pages',function() {
        //   this.on('pages.code', '=', 'p.code').orOn('pages.code', '=', 'p2.code')
        // })
        // .select("pages.*")
        // .distinct()
        // .where('user_id',global.request._user.id)
        // .orderBy('pages.sort')
        let ps=await global.request._user.pageSql(global.request._user.id)
        rs.menu=ps;
        return rs;
  }
  async  home(){
      return {
          title:"博客管理后台",
          description:'网站描述',
          button: {
              icon: "icon-people",
              variant: "primary",
              text: "用户管理",
              to: "/rest/users"
          },
          statics: [
              {
              bg: "info",
              icon: "icon-speedometer",
              value: 5000 + parseInt(Math.random() * 5000),
              title: "Comments",
              progress: 78
              },
              {
              bg: "success",
              icon: "icon-people",
              value: 10000 + parseInt(Math.random() * 10000),
              title: "Users",
              progress: 60
              },
              {
              bg: "warning",
              icon: "icon-basket-loaded",
              value: 100000 + parseInt(Math.random() * 30000),
              title: "Sales",
              progress: 92
              },
              {
              bg: "primary",
              icon: "icon-camrecorder",
              value: 300 + parseInt(Math.random() * 300),
              title: "Videos",
              progress: 67
              }
          ],
          html: `<div>基于 based on vue 2 and bootstrap 4 </div>
          <div class="font-weight-bold">html内容...</div>
          `
      };
  }
  async settings({request,response}){
      const settingForm = {
          title: "系统设置",
          fields: {
            name: { label: "系统名称", input_cols: 4},
            logo: { label: "系统Logo", type: "image", input_cols: 4 },
            theme_switcher:  { label: "主题切换",type: "switch", input_cols: 1},
            menu: {
              type: "array",
              is_table: true,
              fields: {
                name: {},
                _actions: {}
              }
            }
          },
          value: {
            name: "REST ADMIN",
            menu: [],
            theme_switcher:true,
          }
        }
        return settingForm;
  }
  async save_settings({request,response}){
      let model = request.body;
      console.log(model);

      response.send(model);
  }
}

module.exports = SiteController
