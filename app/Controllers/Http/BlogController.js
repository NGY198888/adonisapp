'use strict'
class BlogController {
    async index({view}){
        return view.render('blog');
    }
}

module.exports = BlogController
