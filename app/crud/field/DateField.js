const BaseField= require('./BaseField');
class DateField extends BaseField{
  constructor(label, field = null){
    super(label, field)
    this.type="date"
  }
  parseQuery(queryBuild) {
    queryBuild=queryBuild.whereRaw(`datediff(${this.field}, '${this.val}' )=0`);
    return this
  }
}
module.exports=DateField;
