'use strict'
const Product=use('App/Models/Product')
class SetController {
    async index({request}){
        console.log(request.all());
        console.log(request.get());
        console.log(request.raw());
        console.log(request.body);
        console.log(request.only(['name','type']));
        console.log(request.except(['name2','type']));
        
    //    let p=  new Product(request.all())
    //     p.type=1;
    //     await p.save();
        return await Product.all();
    }
}

module.exports = SetController
