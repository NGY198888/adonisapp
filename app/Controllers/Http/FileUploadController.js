'use strict'
const Helpers = use('Helpers')
const Drive=use('Drive')
const moment = require('moment');
const stringRandom = require('string-random');
class FileUploadController {
  async upload({ request, response }){
        const profilePic = request.file('file', {
          // types: ['image'],
          size: '2mb'
        })
        moment.locale('zh-cn');
        let formatDate =moment().format('YYYYMMDDHHmmss'); /*格式化时间*/
        let randStr=stringRandom(4);
        let path='uploads/files';
        let name=`${formatDate}${randStr}.${profilePic.extname}`
        await profilePic.move(Helpers.appRoot(`public/${path}`), {
          name,
          overwrite: true
        })
        if (!profilePic.moved()) {
          return profilePic.error()
        }
        path=`${path}/${name}`
        // const exists2 = await Drive.exists(`public/${path}`) 文件存在 跟config/drive.js有关
        let host=request.header('host')
        let url=`http://${host}/${path}`
        response.send({
          name,
          path:`public/${path}`,
          url,
        })
  }
}

module.exports = FileUploadController
