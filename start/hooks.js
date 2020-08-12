const { hooks } = require('@adonisjs/ignitor')

const getQueryStr=(obj)=>{
  if (!obj || typeof obj === 'string') obj = { sql: obj ,bindings:[]}
  return obj.sql +' 参数 '+ obj.bindings.join(',')
}
hooks.after.providersBooted(() => {
  const Database = use('Database')
  Database.on('query', (obj)=>{
   // let aaa=getQueryStr(obj)
  })
  Database.on('query-error', (err, obj)=>{
   console.log(err, getQueryStr(obj));
  })
})

