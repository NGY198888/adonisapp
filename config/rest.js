module.exports = {
    //route module name
    api: {
      //authenticator name
      auth: 'jwt',
  
      // which means there are only `index` and `show` routes
      isAdmin: false,
      //all of your resources config
      resources: {
        
        // for `/products`
        products: {
          // must access with a valid token
          auth: false,
          // all of your default query config for `/products`
          query: {
  
            // when list all products
            index: {
              // fetch appends, please refer to **Appends**
              append: ['is_buy'],
  
              // fetch related data
              with: ['categories'],
  
              // also you can define default sorting
              sort: { _id: -1 },
            },
  
            // when show a product
            show: {
              append: ['is_buy'],
            }
          }
        },
        
      }
    },
    admin: {
      //maybe `adminJwt`
      auth: 'jwt',
  
      //allow C(create)/U(update)D/(delete) routes
      isAdmin: true,
  
      //allow destroy all routes
      allowDestroyAll: true,
  
  
      resources: {
        // ...
      }
    }
  }