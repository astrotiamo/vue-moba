module.exports = options => {
  return async (req, res, next) => {  //中间件
    // 将categoris 转换成 Category
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../models/${modelName}`)
    next()
  }
}