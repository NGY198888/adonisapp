'use strict'
const CrudController = require('./CrudController');
class PageController  extends CrudController  {
  get resource(){
    return 'pages'
  }
}
module.exports = PageController
