'use strict'

const Post=use('App/Models/Post')
const {validate}=use('Validator')
const _lodash = require('lodash');
const CrudController = require('./CrudController');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with posts
 */
class PostController  extends CrudController  {

  get resource(){
    return 'posts'
  }
}

module.exports = PostController
