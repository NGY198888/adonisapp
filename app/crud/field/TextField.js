const BaseField= require('./BaseField');
class TextField extends BaseField{

  constructor(label, field = null){
    super(label, field)
    this.type="text"
  }
  parseQuery(queryBuild) {
    queryBuild=queryBuild.where(this.field,'like', `%${this.val}%`);
    return this
  }
}
module.exports=TextField;
